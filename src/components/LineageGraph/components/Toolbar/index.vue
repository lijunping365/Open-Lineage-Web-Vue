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
}

const props = defineProps<ToolBarProps>();
const emit = defineEmits([
  'handleZoomOut',
  'handleZoomIn',
  'handleRealZoom',
  'handleAutoZoom',
  'handleRefreshLayout',
  'handleDownloadImage',
  'handleEnterFullscreen',
  'handleExitFullscreen',
  'handleChangeSize',
]);
const isFull = ref(true);

const options = [
  {
    key: 'zoomOut',
    description: '放大',
    name: ZoomInOutlined,
    action: () => {
      emit('handleZoomOut');
    },
  },
  {
    key: 'zoomIn',
    description: '缩小',
    name: ZoomOutOutlined,
    action: () => {
      emit('handleZoomIn');
    },
  },
  {
    key: 'autoZoom',
    description: '自适应',
    name: OneToOneOutlined,
    action: () => {
      emit('handleAutoZoom');
    },
  },
  {
    key: 'realZoom',
    description: '视图居中',
    name: BorderOuterOutlined,
    action: () => {
      emit('handleRealZoom');
    },
  },
  {
    key: 'clearCanvas',
    description: '恢复布局',
    name: UndoOutlined,
    action: () => {
      emit('handleRefreshLayout');
    },
  },
  {
    key: 'downloadImage',
    description: '下载图片',
    name: FileImageOutlined,
    action: () => {
      emit('handleDownloadImage');
    },
  },
  isFull.value
    ? {
        key: 'fullscreenOutlined',
        description: '全屏查看',
        name: FullscreenOutlined,
        action: () => {
          isFull.value = !isFull.value;
          emit('handleEnterFullscreen');
        },
      }
    : {
        key: 'fullscreenExitOutlined',
        description: '退出全屏',
        name: FullscreenExitOutlined,
        action: () => {
          isFull.value = !isFull.value;
          emit('handleExitFullscreen');
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
    emit("handleChangeSize",width,height)
  } else {
    isFull.value = false;
    // 全屏查看修改canvas宽高
    const width = windowWidth;
    const height = window.outerHeight;
    emit("handleChangeSize",width,height)
  }
};
</script>

<style scoped>
@import url('./index.css');
</style>
