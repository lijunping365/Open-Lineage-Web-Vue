<template>
  <div class="g6-component-toolbar-content">
    <Tooltip
      v-for="(item, index) in options"
      :key="index"
      :title="item.description"
      placement="left"
      color="blue"
    >
      <Button
        type="text"
        class="g6-component-toolbar-item"
        @click="item.action"
      >
        <component :is="item.name" />
      </Button>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  BorderOuterOutlined,
  UndoOutlined,
  OneToOneOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileImageOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons-vue';
import { Button, Tooltip } from 'ant-design-vue';

interface ToolBarProps {
  layout: string;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  handleRealZoom: () => void;
  handleAutoZoom: () => void;
  handleRefreshLayout: () => void;
  handleDownloadImage: () => void;
  handleEnterFullscreen: () => void;
  handleExitFullscreen: () => void;
  handleChangeSize: (width: number, height: number) => void;
}

const props = defineProps<ToolBarProps>();
const isFull = ref(true);

const options = [
  {
    key: 'zoomOut',
    description: '放大',
    name: ZoomInOutlined,
    action: () => {
      props.handleZoomOut();
    },
  },
  {
    key: 'zoomIn',
    description: '缩小',
    name: ZoomOutOutlined,
    action: () => {
      props.handleZoomIn();
    },
  },
  {
    key: 'autoZoom',
    description: '自适应',
    name: OneToOneOutlined,
    action: () => {
      props.handleAutoZoom();
    },
  },
  {
    key: 'realZoom',
    description: '视图居中',
    name: BorderOuterOutlined,
    action: () => {
      props.handleRealZoom();
    },
  },
  {
    key: 'clearCanvas',
    description: '恢复布局',
    name: UndoOutlined,
    action: () => {
      props.handleRefreshLayout();
    },
  },
  {
    key: 'downloadImage',
    description: '下载图片',
    name: FileImageOutlined,
    action: () => {
      props.handleDownloadImage();
    },
  },
  isFull.value
    ? {
        key: 'fullscreenOutlined',
        description: '全屏查看',
        name: FullscreenOutlined,
        action: () => {
          isFull.value = !isFull.value;
          props.handleEnterFullscreen();
        },
      }
    : {
        key: 'fullscreenExitOutlined',
        description: '退出全屏',
        name: FullscreenExitOutlined,
        action: () => {
          isFull.value = !isFull.value;
          props.handleExitFullscreen();
        },
      },
];

onMounted(() => {
  document.addEventListener('webkitfullscreenchange', checkFull);
  document.addEventListener('mozfullscreenchange', checkFull);
  document.addEventListener('fullscreenchange', checkFull);
  document.addEventListener('MSFullscreenChange', checkFull);
});

onUnmounted(() => {
  document.removeEventListener('webkitfullscreenchange', checkFull);
  document.removeEventListener('mozfullscreenchange', checkFull);
  document.removeEventListener('fullscreenchange', checkFull);
  document.removeEventListener('MSFullscreenChange', checkFull);
});

const checkFull = () => {
  const windowWidth = document.documentElement.clientWidth;
  if (
    !(document as any).mozFullScreen &&
    !(document as any).webkitIsFullScreen &&
    !(document as any).msFullscreenElement
  ) {
    isFull.value = true;
    // 退出全屏修改canvas宽高
    const windowHeight = document.documentElement.clientHeight;
    const width = props.layout === 'preview' ? windowWidth : windowWidth - 340;
    const height = window.outerHeight - 141 || windowHeight;
    props.handleChangeSize(width, height);
  } else {
    isFull.value = false;
    // 全屏查看修改canvas宽高
    const width = windowWidth;
    const height = window.outerHeight;
    props.handleChangeSize(width, height);
  }
};
</script>

<style scoped>
@import url('./index.css');
</style>
