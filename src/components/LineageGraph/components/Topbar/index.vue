<template>
  <div class="g6-component-topbar-content">
    <div
      v-for="(item, index) in options"
      :key="index"
      class="g6-component-topbar-item"
    >
      <span>{{ item.name }}</span>
      <Switch
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
const emit = defineEmits(["handleFieldLineage","handleWholeLineage"]);
const fieldChecked = ref(true);
const wholeChecked = ref(true);

const handleFieldLineage = (checked)=>{
    fieldChecked.value = checked;
      emit("handleFieldLineage",checked)
}
const handleWholeLineage = (checked)=>{
    wholeChecked.value = checked;
      emit("handleWholeLineage",checked)
}

const options = [
  {
    key: 'zoomOut',
    name: '字段级血缘关系',
    value: fieldChecked,
    action:handleFieldLineage
  },
  {
    key: 'zoomIn',
    name: '完整血缘链路',
    value: wholeChecked,
    action:handleWholeLineage

  },
];

</script>

<style scoped>
@import './index.css';
</style>
