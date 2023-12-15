<!--
 * @Author: yuxuanli 
 * @Date: 2023-12-15 14:52:29
 * @LastEditors: yuxuanli 
 * @LastEditTime: 2023-12-15 15:07:35
 * @FilePath: \Open-Lineage-Web-Vue\src\components\Footer\index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <footer class="absolute bottom-0 z-[200] h-8 min-w-full bg-white">
    <div class="mx-auto flex flex-col items-center border-t px-5 py-2 shadow-md sm:flex-row">
      <p class="space-x-4 text-sm font-medium">
        <span>节点：{{ props.nodeSize }}</span>
        <span>层数：{{ props.nodeLevel }}</span>
      </p>
      <span class="inline-flex justify-center sm:ml-auto sm:mt-0 sm:justify-start">
        <a
          :href="metadata.website"
          class="ml-1 text-sm text-gray-600"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ metadata.copyright }}
        </a>
      </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  nodeSize: number;
  nodeLevel: number;
}>();

const metadata = {
  website: '/',
  copyright: 'Copyright © 2022-present',
};
</script>