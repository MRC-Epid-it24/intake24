<template>
  <v-tab-item key="graph" ref="root" value="graph">
    <v-container>
      <v-row align="center">
        <v-switch class="ml-3" :input-value="useGraph" label="Use graph" @change="useGraphChange" />
        <v-btn class="ml-8" @click="resetGraph()">
          Reset
        </v-btn>
      </v-row>
    </v-container>
    <canvas ref="canvas" />
  </v-tab-item>
</template>

<script lang='ts'>
import { LGraph, LGraphCanvas, LGraphNode, LiteGraph } from 'litegraph.js';
import Vue, { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { PromptContextNode, type PromptNode } from '@intake24/common/prompts/graph/nodes/prompt';
import { stringHash } from '@intake24/common/util/string-hash';

class PromptGraph extends LGraph {
  private readonly onChange: (data: object) => void;
  private contentHash?: number;

  constructor(onChange: (data: object) => void) {
    super();
    this.onChange = onChange;
  }

  afterChange(_info?: LGraphNode) {
    const serialized = this.serialize();
    // This is a bit ridiculous but does the job
    this.contentHash = stringHash(JSON.stringify(serialized));
    this.onChange(serialized);
  }

  configure(data: object, keep_old?: boolean): boolean | undefined {
    const contentHash = stringHash(JSON.stringify(data));
    if (contentHash === this.contentHash) {
      return undefined;
    }
    this.contentHash = contentHash;
    return super.configure(data, keep_old);
  }

  clear() {
    super.clear();
    this.contentHash = undefined;
  }
}

export default defineComponent({
  name: 'PromptGraph',

  props: {
    graph: {
      type: Object,
      required: false,
    },
    useGraph: {
      type: Boolean,
      required: false,
    },
  },

  emits: ['update:graph', 'update:useGraph'],

  setup(props, { emit }) {
    const canvasElementRef = ref(null as HTMLCanvasElement | null);
    const rootRef = ref(null as Vue | null);

    let graphCanvas: LGraphCanvas | null = null;
    let graph: PromptGraph | null = null;

    const observer = new ResizeObserver(() => {
      const canvasElement = canvasElementRef.value;
      const rootElement = rootRef.value?.$el;

      if (canvasElement && rootElement && graphCanvas) {
        canvasElement.width = rootElement.clientWidth;
        canvasElement.height = rootElement.clientWidth * 0.6;
        graphCanvas.setDirty(true, true);
      }
    });

    const applyProps = () => {
      if (graph === null)
        throw new Error(`Did not expect graph to be null here`);

      if (props.graph) {
        graph.configure(props.graph);
      }
      else {
        console.log('graph.clear');

        graph.clear();

        const promptNode = LiteGraph.createNode<PromptNode>('Prompt/Properties');
        promptNode.pos = [800, 300];
        graph.add(promptNode);

        const contextNode = LiteGraph.createNode<PromptContextNode>('Prompt/Context');
        contextNode.pos = [200, 300];
        graph.add(contextNode);
      }
    };

    const initGraph = () => {
      const canvasElement = canvasElementRef.value;

      if (canvasElement == null)
        throw new Error(`Did not expect canvasElement to be null here`);

      graph = new PromptGraph(graphData => emit('update:graph', graphData));

      applyProps();

      graphCanvas = new LGraphCanvas(canvasElement, graph, { autoresize: false });
    };

    watch(() => props.graph, () => {
      applyProps();
    });

    onMounted(() => {
      const rootElement = rootRef.value?.$el;

      // Template root element is a comment placeholder unless this tab has already been
      // activated, in which case we need to wait until it becomes a valid Element
      if (rootElement && rootElement.nodeType === Node.ELEMENT_NODE) {
        observer.observe(rootElement);
        initGraph();
      }
      else {
        const removeWatch = watch(() => rootRef.value?.$el, (value) => {
          if (!value)
            throw new Error(`Did not expect root element to be null here`);
          if (value.nodeType === Node.ELEMENT_NODE) {
            observer.observe(value);
            initGraph();
            removeWatch();
          }
        });
      }
    });

    onBeforeUnmount(() => {
      observer.disconnect();
    });

    const resetGraph = () => {
      emit('update:graph', undefined);
    };

    const useGraphChange = (v) => {
      console.log(`useGraphChange ${v}`);
      emit('update:useGraph', v);
    };

    return {
      canvas: canvasElementRef,
      root: rootRef,
      resetGraph,
      useGraphChange,
    };
  },

});
</script>

<style lang='css'>
@import 'litegraph.js/css/litegraph.css';

.litegraph.litecontextmenu {
  z-index: 1000;
}
</style>
