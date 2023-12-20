<template>
  <div
    ref="containerElement"
    :style="style"
  />
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue';
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
  width: processSize(props.width || ''),
  height: processSize(props.height || ''),
});

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
  console.log(11111111);
  style.value.width = val;
  //   editor.value?.layout();
};

const updateLayoutHeight = (val) => {
  console.log(11111111);
  style.value.height = val;
  //   editor.value?.layout();
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
