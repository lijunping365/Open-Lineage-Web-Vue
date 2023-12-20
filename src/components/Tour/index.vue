<template>
  <Tour
    :open="isOpen"
    :steps="steps"
    @close="handleClose"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, createVNode } from 'vue';
import { Tour, TourProps } from 'ant-design-vue';
import tour1 from '/tour1.gif';
import tour2 from '/tour2.png';

const props = defineProps<{ ref1: any; ref2: any }>();

const isOpen = ref(false);
const steps: TourProps['steps'] = [
  {
    title: 'SQL 编辑区',
    placement: 'right',
    description: '编辑完SQL之后点击解析血缘按钮即可看到效果',
    cover: () => createVNode('img', { attrs: { alt: 'tour1.gif', src: tour1 } }),
    target: () => props.ref1.value,
  },
  {
    title: '血缘展示区',
    placement: 'center',
    description: '根据你的SQL生成的血缘图将会在这里展示',
    cover: () => createVNode('img', { attrs: { alt: 'tour2.png', src: tour2 } }),
    target: () => props.ref2.value,
  },
];

const handleClose = () => {
  isOpen.value = false;
};

onMounted(() => {
  isOpen.value = true;
});

onUnmounted(() => {
  // 如果需要在组件卸载时清理资源，可以在此处添加代码
});
</script>
