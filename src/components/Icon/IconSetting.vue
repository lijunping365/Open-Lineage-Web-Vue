<!--
 * @Author: yuxuan-ctrl 
 * @Date: 2023-12-19 16:19:07
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2023-12-21 15:45:20
 * @FilePath: \Open-Lineage-Web-Vue\src\components\Icon\IconSetting.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <svg
      :width="36"
      :height="36"
      viewBox="-6 -6 36 36"
      :stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="className"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        :stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  
  interface IconSettingProps {
    className?: string;
  }
  
  const props = withDefaults(defineProps<IconSettingProps>(), {
    className: '',
  });
  
  const className = computed(() => props.className);
  </script>