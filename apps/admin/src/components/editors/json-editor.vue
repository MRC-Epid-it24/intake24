<template>
  <json-editor-vue v-bind="{ readOnly, stringified: false, value }" @input="input" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'JsonEditor',

  components: {
    JsonEditorVue: () => import('json-editor-vue'),
  },

  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, Object],
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const input = (value: string | object) => {
      emit('input', value);
    };

    return { input };
  },
});
</script>
