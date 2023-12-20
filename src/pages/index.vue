<template>
  <div>
    <Header
      :model="model"
      :theme="theme"
      :layout="layout"
      @themeChange="(newTheme: string) => (theme = newTheme)"
      @layoutChange="(newLayout: string) => (layout = newLayout)"
      @nodeSizeChange="(newTestSize: number) => (testSize = newTestSize)"
      @handleParseSql="handleParseSql"
      :highlightColor="highlightColor"
      :textWaterMarker="textWaterMarker"
      @modelChange="(newModel: string) => (model = newModel)"
      @highlightColorChange="(newHighlightColor: string) => (highlightColor = newHighlightColor)"
      @textWaterMarkerChange="(newTextWaterMarker: string) => (textWaterMarker = newTextWaterMarker)"
    />
    <main class="flex-auto overflow-hidden border-t border-gray-200">
      <!-- <SplitPane v-bind="splitPaneProps"> -->
      <div class="splitPane">
        <div class="pane1">
        <div
          class="flex flex-auto"
          ref="ref1"
        >
          <MonacoEditor
            :width="'400px'"
            :height="'100vh'"
            :language="'sql'"
            :theme="theme"
            v-model="code"
          />
        </div>
      </div>
      <div class="pane2">
        <div
          class="absolute inset-0 w-full overflow-auto md:h-full"
          ref="ref2"
        >
          <Spin :spinning="loading">
            <template v-if="model === 'test'">
              <LineageGraphTest
                :layout="layout"
                :lineageData="lineageData"
                :highlightColor="highlightColor"
                :textWaterMarker="textWaterMarker"
              />
            </template>
            <template v-else>
              <LineageGraph
                :layout="layout"
                :lineageData="lineageData"
                v-model:nodeSize="nodeSize"
                v-model:nodeLevel="nodeLevel"
                @nodeLevel="(newNodeLevel: number) => (nodeLevel = newNodeLevel)"
                :highlightColor="highlightColor"
                :textWaterMarker="textWaterMarker"
              />
            </template>
          </Spin>
        </div>
      </div>
        <!-- </SplitPane> -->
      </div>
    </main>
    <Footer
      :nodeSize="nodeSize"
      :nodeLevel="nodeLevel"
    />
    <!-- <ITour
        ref1="ref1"
        ref2="ref2"
      /> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from '../components/Header/index.vue';
import Footer from '../components/Footer/index.vue';
import sourceData from '../test/data.json';
import MonacoEditor from '../components/MonacoEditor/index.vue';
import LineageGraph from '../components/LineageGraph/index.vue';
import LineageGraphTest from '../components/LineageGraphTest/index.vue';
import { getLineageData } from '../services/api';
// import SplitPane from 'vue-splitpane';
import { message, Spin } from 'ant-design-vue';
import ITour from '../components/Tour/index.vue';
import { sql } from '../test/sql';
import { initData } from '../test/test';

const props = defineProps();
const size = ref({ percentage: 0.25 });
const layout = ref('vertical');
const theme = ref('vs-light');
const model = ref('default');
const testSize = ref(0);
const code = ref(sql());
const loading = ref(false);
const lineageData = ref<any>();
const highlightColor = ref('red');
const textWaterMarker = ref('OpenLineage');
const ref1 = ref(null);
const ref2 = ref(null);
const nodeSize = ref(0);
const nodeLevel = ref(0);

const splitPaneProps = {
  split: 'vertical',
  minSize: size.value.min,
  maxSize: size.value.max,
  // size: size.value.current,
  // onChange: (newSize: any) => console.log(newSize),
  // onDragStarted: () => console.log('拖动开始'),
  // onDragFinished: () => console.log('拖动结束'),
  // allowResize: false,
};

const handleParseSql = () => {
  if (model.value === 'test') {
    nodeSize.value = testSize.value;
    nodeLevel.value = testSize.value;
    lineageData.value = initData(testSize.value);
  } else {
    lineageData.value = sourceData.data;
  }

  // if (!sql) return;
  //
  // loading.value = true;
  // getLineageData('hive', sql)
  //   .then((data: any) => {
  //     lineageData.value = data;
  //   })
  //   .catch((e: any) => {
  //     message.error('处理异常！' + e);
  //   })
  //   .finally(() => loading.value = false);
};
function updateSize() {
  size.value = {
    ...size.value,
    current:
      layout.value !== 'preview' ? document.documentElement.clientWidth : 0,
    min: layout.value !== 'preview' ? 340 : 0,
    max:
      layout.value !== 'preview'
        ? document.documentElement.clientWidth - 340
        : 0,
  };
  console.log(
    '🚀 ~ file: index.vue:135 ~ updateSize ~ size.value:',
    size.value
  );
}

onMounted(() => {
  updateSize();
  window.addEventListener('resize', updateSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSize);
});

const handleChangeModel = (newModel: string) => {
  model.value = newModel;
  lineageData.value = null;
  nodeSize.value = 0;
  nodeLevel.value = 0;
  testSize.value = 0;
};
</script>

<style scoped>
.splitPane {
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  user-select: text;
  flex-direction: row;
  left: 0px;
  right: 0px;
}

.pane1{
  flex: 0 0 auto;
    position: relative;
    outline: none;
    width: 340px;
}

.pane2{
  flex: 1 1 0%;
    position: relative;
    outline: none;
}
</style>
