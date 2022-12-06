<template>
  <prompt-layout v-bind="{ food, meal, prompt, isValid }" @action="action"> </prompt-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'InfoPrompt',

  mixins: [createBasePrompt<'info-prompt'>()],

  data() {
    return {
      currentValue: 'ok',
    };
  },

  computed: {
    isValid(): boolean {
      return true;
    },
  },

  methods: {
    update() {
      this.$emit('update', { state: this.currentValue, valid: this.isValid });
    },

    confirm() {
      this.update();
      return true;
    },
  },
});
</script>

<style lang="scss" scoped></style>
