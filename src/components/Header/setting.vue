<template>
  <Popover
    title="设置"
    trigger="click"
    :open="open"
    @openChange="(val:any) => $emit('update:open', val)"
  >
    <template #content>
      <slot />
    </template>
    <button
      type="button"
      :class="
        [
          'dark:shadow-highlight/4 block shadow-sm ring-1 ring-gray-900/5 hover:bg-gray-50 dark:bg-gray-800 dark:ring-0 dark:hover:bg-gray-700',
          'group rounded-md focus:outline-none focus-visible:ring-2',
          open
            ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400'
            : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500',
        ].join(' ')
      "
    >
      <span class="sr-only">设置</span>
      <IconSetting
        :class="
          [
            open
              ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400'
              : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400',
          ].join(' ')
        "
      />
    </button>
  </Popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Popover } from 'ant-design-vue';
import IconSetting from '../Icon/IconSetting.vue';

export default defineComponent({
  components: {
    Popover,
    IconSetting,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

