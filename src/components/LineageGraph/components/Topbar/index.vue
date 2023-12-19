<template>
  <div class="g6-component-topbar-content">
    <div
      v-for="(item, index) in options"
      :key="index"
      class="g6-component-topbar-item"
    >
      <span>{{ item.name }}</span>
      <a-switch
        size="small"
        :checked="item.value"
        @change="item.action"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Switch } from 'ant-design-vue';

interface TopBarProps {
  handleFieldLineage: (checked: boolean) => void;
  handleWholeLineage: (checked: boolean) => void;
}

const props = defineProps<TopBarProps>();
const fieldChecked = ref(true);
const wholeChecked = ref(true);

const options = [
  {
    key: 'zoomOut',
    name: '字段级血缘关系',
    value: fieldChecked.value,
    action(checked: boolean) {
      fieldChecked.value = checked;
      props.handleFieldLineage(checked);
    },
  },
  {
    key: 'zoomIn',
    name: '完整血缘链路',
    value: wholeChecked.value,
    action(checked: boolean) {
      wholeChecked.value = checked;
      props.handleWholeLineage(checked);
    },
  },
];
</script>

<style scoped>
@import './index.css';
</style>
