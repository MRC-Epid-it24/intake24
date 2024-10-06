<template>
  <json-editor-vue v-bind="{ readOnly, stringified: false, modelValue }" @update:model-value="input" />
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'JsonEditor',

  components: {
    JsonEditorVue: defineAsyncComponent(() => import('json-editor-vue')),
  },

  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [Array, Object],
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const input = (value: string | object) => {
      emit('update:modelValue', value);
    };

    return { input };
  },
});
</script>
