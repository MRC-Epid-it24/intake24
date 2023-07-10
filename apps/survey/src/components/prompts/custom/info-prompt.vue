<template>
  <card-layout v-bind="{ food, meal, prompt, isValid }" @action="action"></card-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [createBasePrompt<'info-prompt'>()],

  props: {
    value: {
      type: String,
      default: 'ok',
    },
  },

  emits: ['input'],

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('input', this.value);
    },

    confirm() {
      this.update();
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
