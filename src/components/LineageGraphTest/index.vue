<template>
  <div>
    <div
      ref="canvasWrapper"
      class="canvas-wrapper"
    >
      <div
        ref="toolbarRef"
        class="g6-component-toolbar"
      >
        <Toolbar
          :layout="layout"
          @handleChangeSize="handleChangeSize"
          @handleZoomOut="() => handleZoomOut(graphRef)"
          @handleZoomIn="() => handleZoomIn(graphRef)"
          @handleRealZoom="() => handleRealZoom(graphRef)"
          @handleAutoZoom="() => handleAutoZoom(graphRef)"
          @handleRefreshLayout="() => handleRefreshLayout(graphRef)"
          @handleDownloadImage="() => handleDownloadImage(graphRef)"
          @handleEnterFullscreen="() => handleEnterFullscreen(canvasWrapper)"
          @handleExitFullscreen="handleExitFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, toRaw, watch, watchEffect } from 'vue';
import Toolbar from '../LineageGraph/components/Toolbar/index.vue';
import G6 from '@antv/g6';
import '../LineageGraph/index.css';
import '../LineageGraph/registerShape';
import '../LineageGraph/registerLayout';
import { getLeftRelation, getRightRelation } from '../../utils/common';
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
import { dataTransform } from '../../test/test';

const props = defineProps<{
  layout: any;
  lineageData: any;
  textWaterMarker: string;
  highlightColor: string;
}>();

const toolbarRef = ref(); // 或者使用正确的类型代替any
const graphRef = ref();
const canvasWrapper = ref();
const fieldCheckedRef = ref(true);
const wholeCheckedRef = ref(true);
const currentHighlightColorRef = ref(props.highlightColor);

watch(
  () => props.lineageData,
  (lineageData) => {
    if (lineageData) {
      const data = dataTransform(lineageData);
      renderGraph(toRaw(graphRef.value), data);
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

onUnmounted(() => {
  // 清理相关资源
});

/**
 * 处理节点点击事件
 */
function handleNodeClick(
  graph: any,
  item: any,
  currentAnchor: string,
  name: string
) {
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
}

/**
 * 处理连线点击事件
 */
function handleEdgeClick(graph: any, item: any, name: string) {
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
}

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

function bindEvents(graph: any) {
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
}

const handleChangeSize = (width: any, height: any) => {
  graphRef.value.changeSize(width, height);
  graphRef.value.fitView();
};

onMounted(() => {
  if (!graphRef.value) {
    // 实例化 Minimap
    const minimap = new G6.Minimap();
    // 工具栏
    const toolbar = new G6.ToolBar({
      getContent: () => {
        return toRaw(toolbarRef.value) || '';
      },
    });
    // 网格画布
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
    const graph = graphRef.value;
    // 设置文字水印
    graph.setTextWaterMarker(props.textWaterMarker);
    bindEvents(graph);
  }
});

defineExpose({
  fieldCheckedRef,
  wholeCheckedRef,
  currentHighlightColorRef,
  handleNodeClick,
  handleEdgeClick,
  handleChangeSize,
  handleZoomOut,
  handleZoomIn,
  handleRealZoom,
  handleAutoZoom,
  handleRefreshLayout,
  handleDownloadImage,
  handleEnterFullscreen,
  handleExitFullscreen,
});
</script>

<style scoped>
:-webkit-full-screen {
  background-color: #ffffff !important;
}
:-moz-full-screen {
  background-color: #ffffff !important;
}

:-ms-fullscreen {
  background-color: #ffffff !important;
}
:fullscreen {
  background-color: #ffffff !important;
}
</style>