<template>
  <div>
    <div class="swatch" @click="handleClick">
      <div class="color" :style="{ background: color }" />
    </div>
    <transition name="fade">
      <div v-if="displayColorPicker" class="popover">
        <div class="cover" @click="handleClose" />
        <SketchPicker v-model:value="color" @change="handleChange" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed ,PropType} from 'vue';
import { SketchPicker } from 'react-color';

interface ColorPickerProps {
  defaultColor?: string;
  onChange?: (value: any) => void;
}

const props = defineProps({
  defaultColor: {
    type: String,
    default: '#4A90E2',
  },
  onChange: {
    type: Function as PropType<(value: any) => void>,
    default: undefined,
  },
});

const displayColorPicker = ref(false);
const color = ref<string>(props.defaultColor || '#4A90E2');

const handleClick = () => {
  displayColorPicker.value = !displayColorPicker.value;
};

const handleClose = () => {
  displayColorPicker.value = false;
};

const handleChange = ({ hex }: any) => {
  color.value = hex;
  if (props.onChange) {
    props.onChange(hex);
  }
};
</script>