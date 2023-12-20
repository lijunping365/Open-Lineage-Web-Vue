<template>
  <div>
    <div
      ref="canvasWrapper"
      class="canvas-wrapper"
    >
      <div class="g6-component-topbar">
        <Topbar
          :ref="topBarRef"
          @handleFieldLineage="onFieldLineage"
          @handleWholeLineage="onWholeLineage"
        />
      </div>
      <div
        ref="toolbarRef"
        class="g6-component-toolbar"
      >
        <Toolbar
          :layout="layout"
          :handleChangeSize="handleChangeSize"
          @handleZoomOut="handleZoomOut(graphRef)"
          @handleZoomIn="handleZoomIn(graphRef)"
          @handleRealZoom="handleRealZoom(graphRef)"
          @handleAutoZoom="handleAutoZoom(graphRef)"
          @handleRefreshLayout="handleRefreshLayout(graphRef)"
          @handleDownloadImage="handleDownloadImage(graphRef)"
          @handleEnterFullscreen="handleEnterFullscreen(canvasWrapper)"
          @handleExitFullscreen="handleExitFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, reactive, watch, watchEffect } from 'vue';
import Toolbar from './components/Toolbar/index.vue';
import Topbar from './components/Topbar/index.vue';
import G6 from '@antv/g6';
import './index.css';
import './registerShape';
import './registerLayout';
import {
  collapseData,
  getLeftRelation,
  getRightRelation,
  transformData,
} from '../../utils/common';
import {
  clearAllStats,
  handleAutoZoom,
  handleDownloadImage,
  handleEnterFullscreen,
  handleExitFullscreen,
  handleHighlightColor,
  handleRealZoom,
  handleRefreshLayout,
  handleTextWaterMarker,
  handleZoomIn,
  handleZoomOut,
  renderGraph,
  setLeftStats,
  setRightStats,
} from '../../utils/graphUtil';
import { dataTransform, initData } from '../../test/test';
import screenfull from "screenfull";

interface LineageGraphProps {
  /**
   * 布局
   */
  layout: any;
  /**
   * 血缘数据
   */
  lineageData: any;
  /**
   * 水印文字
   */
  textWaterMarker: string;
  /**
   * 高亮颜色
   */
  highlightColor: string;
}

const props = defineProps<LineageGraphProps>();
const emit = defineEmits(['update:nodeSize', 'update:nodeLevel']);

const canvasWrapper = ref();
const graphRef = ref();
const fieldCheckedRef = ref(true);
const wholeCheckedRef = ref(true);
const topBarRef = ref(); // 或者使用正确的类型代替any
const toolbarRef = ref(); // 或者使用正确的类型代替any
const currentHighlightColorRef = ref(props.highlightColor);

const lineageWholeData = ref();
const lineagePartData = ref();
const nodeSize = ref<number>(0);
const nodeLevel = ref<number>(0);

onMounted(() => {
  if (!graphRef.value) {
    // 实例化 Minimap
    const minimap = new G6.Minimap();
    // TODO 报错
    // 工具栏
    // const toolbar = new G6.ToolBar({
    //   getContent: () => {
    //     return toolbarRef.value || '';
    //   },
    // });
    //网格画布
    const grid = new G6.Grid();
    const container: any = canvasWrapper.value;
    const windowWidth = document.documentElement.clientWidth;
    const windowHeight = document.documentElement.clientHeight;
    const width = props.layout === 'preview' ? windowWidth : windowWidth - 340;
    const height = window.outerHeight - 141 || windowHeight;
    // 实例化 Graph
    graphRef.value = new G6.Graph({
      container: container || '',
      width: width,
      height: height,
      plugins: [grid, minimap, toolbar],
      fitView: true,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node'],
      },
      // 布局配置
      layout: {
        type: 'lineageLayout',
        controlPoints: true,
        nodesep: 200,
        ranksep: 600,
        begin: [1000, 1000],
      },
      defaultNode: {
        // size: [300, 800],
        type: 'dice-er-box',
        color: '#096DD9',
        boxStyle: {
          stroke: '#096DD9',
          lineWidth: 6,
          radius: 4,
        },
        style: {
          fill: '#096DD9',
        },
        labelCfg: {
          style: {
            fill: '#ffffff',
            fontSize: 20,
          },
        },
      },
      defaultEdge: {
        type: 'dice-er-edge',
        style: {
          stroke: '#6C6B6B',
          lineWidth: 2,
          endArrow: true,
        },
      },
    });
  }

  if (graphRef.value) {
    const graph = graphRef.value as any;
    // 设置文字水印
    graph.setTextWaterMarker(props.textWaterMarker);
    bindEvents(graph);
  }
});

watch(
  () => props.lineageData,
  () => {
    fieldCheckedRef.value = true;
    wholeCheckedRef.value = true;
    topBarRef?.value?.setFieldChecked(true);
    topBarRef?.value?.setWholeChecked(true);
    if (props.lineageData) {
      const wholeData = props.lineageData.withProcessData;
      const partData = props.lineageData.noProcessData;
      lineageWholeData.value = wholeData;
      lineagePartData.value = partData;
      nodeSize.value = wholeData.size;
      nodeLevel.value = wholeData.level;

      const data = transformData(wholeData.data);
      renderGraph(graphRef.value, data);
    }
  }
);

watch(
  () => props.textWaterMarker,
  (newValue) => {
    handleTextWaterMarker(graphRef.value, newValue);
  }
);

watch(
  () => props.highlightColor,
  (newValue) => {
    currentHighlightColorRef.value = newValue;
    handleHighlightColor(graphRef.value, newValue);
  }
);

watch(
  () => props.layout,
  (val) => {
    if (graphRef.value) {
      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = document.documentElement.clientHeight;
      const height = window.outerHeight - 141 || windowHeight;
      const width = val === 'preview' ? windowWidth : windowWidth - 340;
      graphRef.value.changeSize(width, height);
      graphRef.value.fitView();
    }
  }
);

const fullScreen = () => {
  if (screenfull.isEnabled) {
    screenfull.request(canvasWrapper.value);
    graphRef.value.resize(
      document.body.clientWidth,
      document.body.clientHeight
    );
  }
};

// 更改canvas宽高
const handleChangeSize = (width: any, height: any) => {
  graphRef.value!.changeSize(width, height);
  graphRef.value!.fitView();
};

const bindEvents = (graph: any) => {
  // 监听节点点击事件
  graph.off('node:click').on('node:click', (evt: any) => {
    const { item, target } = evt;
    const currentAnchor = target.get('name');
    if (!currentAnchor) return;

    if (fieldCheckedRef.value) {
      handleNodeClick(graph, item, currentAnchor, 'highlight');
    } else {
      handleNodeClick(graph, item, currentAnchor, 'tableHighlight');
    }
  });

  // 监听连线点击事件
  graph.off('edge:click').on('edge:click', (evt: any) => {
    const { item } = evt;
    if (fieldCheckedRef.value) {
      handleEdgeClick(graph, item, 'highlight');
    } else {
      handleEdgeClick(graph, item, 'tableHighlight');
    }
  });

  //监听只在 canvas 空白处点击事件
  graph.off('canvas:click').on('canvas:click', (ev: any) => {
    // 清除状态
    clearAllStats(graph);
  });
};

/**
 * 处理节点点击事件
 */
const handleNodeClick = (
  graph: any,
  item: any,
  currentAnchor: string,
  name: string
) => {
  const model = item.getModel();
  const edges = item.getEdges();

  const leftActiveEdges: any[] = [];

  getLeftRelation(edges, model, currentAnchor, leftActiveEdges);

  const rightActiveEdges: any[] = [];

  getRightRelation(edges, model, currentAnchor, rightActiveEdges);

  // 清除状态
  clearAllStats(graph);

  // 设置当前节点状态
  graph.setItemState(item, name + '-' + currentAnchor, true);

  // 设置左关联边及节点状态
  setLeftStats(graph, leftActiveEdges, currentHighlightColorRef.value, name);

  // 设置右关联边及节点状态
  setRightStats(graph, rightActiveEdges, currentHighlightColorRef.value, name);
};

/**
 * 处理连线点击事件
 */
const handleEdgeClick = (graph: any, item: any, name: string) => {
  const sourceNode = item.getSource();
  const sourceModel = sourceNode.getModel();
  const sourceEdges = sourceNode.getInEdges();

  // 获取当前连线的 source 节点
  const sourceAnchor = item.getModel()['sourceAnchor'];

  const leftActiveEdges: any[] = [];
  leftActiveEdges.push(item);

  getLeftRelation(sourceEdges, sourceModel, sourceAnchor, leftActiveEdges);

  const targetNode = item.getTarget();
  const targetModel = targetNode.getModel();
  const targetEdges = targetNode.getOutEdges();

  // 获取当前连线的 target 节点
  const targetAnchor = item.getModel()['targetAnchor'];

  const rightActiveEdges: any[] = [];
  rightActiveEdges.push(item);

  getRightRelation(targetEdges, targetModel, targetAnchor, rightActiveEdges);

  // 清除状态
  clearAllStats(graph);

  // 设置左关联边及节点状态
  setLeftStats(graph, leftActiveEdges, currentHighlightColorRef.value, name);

  // 设置右关联边及节点状态
  setRightStats(graph, rightActiveEdges, currentHighlightColorRef.value, name);
};

 /**
   * 处理字段血缘切换
   */
const onFieldLineage = (checked: boolean) => {
  fieldCheckedRef.value = checked;
  if (!lineageWholeData || !lineagePartData) {
    return;
  }
  let data: any;
  let size: number;
  let level: number;

  if (wholeCheckedRef.value) {
    size = lineageWholeData.value.size;
    level = lineageWholeData.value.level;
  } else {
    size = lineagePartData.value.size;
    level = lineagePartData.value.level;
  }

  if (checked) {
    if (wholeCheckedRef.value) {
      data = transformData(lineageWholeData.value.data);
    } else {
      data = transformData(lineagePartData.value.data);
    }
  } else {
    if (wholeCheckedRef.value) {
      data = collapseData(lineageWholeData.value.data);
    } else {
      data = collapseData(lineagePartData.value.data);
    }
  }
  emit('update:nodeLevel', level);
  emit('update:nodeSize', size);
  renderGraph(graphRef.value, data);
};

/**
 * 处理完整血缘链路切换
 */
const onWholeLineage = (checked: boolean) => {
  wholeCheckedRef.value = checked;
  if (!lineageWholeData.value || !lineagePartData.value) {
    return;
  }
  let data: any;
  let size: number;
  let level: number;
  if (checked) {
    size = lineageWholeData.value.size;
    level = lineageWholeData.value.level;
    if (fieldCheckedRef.value) {
      data = transformData(lineageWholeData.value.data);
    } else {
      data = collapseData(lineageWholeData.value.data);
    }
  } else {
    size = lineagePartData.value.size;
    level = lineagePartData.value.level;
    if (fieldCheckedRef.value) {
      data = transformData(lineagePartData.value.data);
    } else {
      data = collapseData(lineagePartData.value.data);
    }
  }
  emit('update:nodeLevel', level);
  emit('update:nodeSize', size);
  renderGraph(graphRef.value, data);
};
</script>

<style scoped>
@import url("./index.css");
</style>