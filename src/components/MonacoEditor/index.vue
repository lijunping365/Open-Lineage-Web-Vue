<template>
  <div
    ref="containerElement"
    class="monaco"
  />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, watch, toRef, toRaw } from 'vue';
import * as monaco from 'monaco-editor';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { noop, processSize } from './utils';

window.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};

interface MonacoEditorProps {
  width?: string;
  height?: string;
  modelValue?: string;
  defaultValue?: string;
  language?: string;
  theme?: string;
  options?: Record<string, any>;
  onChange?: (value: string, event?: any) => void;
  className?: string;
}

const props = defineProps<MonacoEditorProps>();

const containerElement = ref<HTMLDivElement | null>(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);

const style = ref({
  width: processSize(props.width || '400px'),
  height: processSize(props.height || '100vh'),
});

const width = toRef(style.value, 'width');
const height = toRef(style.value, 'height');

const initMonaco = () => {
  const finalValue =
    props.modelValue !== null ? props.modelValue : props.defaultValue;
  if (!editor.value && containerElement.value) {
    const finalOptions = { ...props.options };
    editor.value = monaco.editor.create(containerElement.value, {
      value: finalValue,
      language: props.language,
      ...(props.className ? { extraEditorClassName: props.className } : {}),
      ...finalOptions,
      ...(props.theme ? { theme: props.theme } : {}),
    });
    editor.value.onDidChangeModelContent((event) => {
      props.onChange && props.onChange(editor.value?.getValue() || '', event);
    });
  }
};

onMounted(() => {
  initMonaco();
  editor.value?.focus();
});

onUnmounted(() => {
  editor.value?.dispose();
});

const updateLayoutWidth = (val) => {
  style.value.width = processSize(val);
  toRaw(editor.value)?.layout();
};

const updateLayoutHeight = (val) => {
  style.value.height = processSize(val);
  toRaw(editor.value)?.layout();
};

watch(() => props.width, updateLayoutWidth);
watch(() => props.height, updateLayoutHeight);

const updateTheme = () => {
  monaco.editor.setTheme(props.theme || '');
};

watch(() => props.theme, updateTheme);

const updateLanguage = () => {
  if (editor.value) {
    const model: any = editor.value.getModel();
    monaco.editor.setModelLanguage(model, props.language || '');
  }
};

watch(() => props.language, updateLanguage);
</script>

<style scoped>
.monaco {
  width: v-bind(width);
  height: v-bind(height);
}
</style>
