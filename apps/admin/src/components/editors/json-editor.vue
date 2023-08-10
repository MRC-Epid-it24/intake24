<template>
  <json-editor-vue :value="value" @input="input"></json-editor-vue>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'JsonEditor',

  components: {
    JsonEditorVue: () => import('json-editor-vue'),
  },

  props: {
    value: {
      type: [Array, Object],
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const input = (value: string | object) => {
      emit('input', typeof value === 'string' ? JSON.parse(value) : value);
    };

    return { input };
  },
});
</script>
