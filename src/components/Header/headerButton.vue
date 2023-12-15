<template>
    <button type="button" :class="[
        className,
        'group rounded-md focus:outline-none focus-visible:ring-2',
        ringClassName || (isActive ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400' : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500'),
    ].join(' ')" @click="$emit('click')">
        <span class="sr-only">{{ label }}</span>
        <svg :width="width" :height="height"
            viewBox="calc((width - naturalWidth) / -2) calc((height - naturalHeight) / -2) width height" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" :class="[
                iconClassName,
                isActive ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400' : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400',
            ].join(' ')">
            <slot />
        </svg>
    </button>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: '',
        },
        ringClassName: {
            type: String,
            default: '',
        },
        width: {
            type: Number,
            default: 42,
        },
        height: {
            type: Number,
            default: 36,
        },
        naturalWidth: {
            type: Number,
            default: 26,
        },
        naturalHeight: {
            type: Number,
            default: 22,
        },
        iconClassName: {
            type: String,
            default: '',
        },
    },
});

</script>