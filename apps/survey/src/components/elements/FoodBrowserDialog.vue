<template>
  <v-dialog
    fullscreen
    :model-value="modelValue"
    transition="dialog-bottom-transition"
    @update:model-value="toggle($event)"
  >
    <v-sheet class="food-browser-dialog-wrapper" color="secondary">
      <v-card-title class="flex-grow-0 pa-4" dark>
        <v-icon color="white" icon="$cancel" :title="$t('common.action.cancel')" @click="toggle(false)" />
      </v-card-title>
      <v-card
        v-bind="{ ...$attrs }"
        class="px-4 pt-4 food-browser-dialog-content overflow-y-auto"
      >
        <slot />
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FoodBrowserDialog',

  inheritAttrs: false,

  props: {
    modelValue: {
      type: Boolean,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const toggle = (value: boolean) => {
      emit('update:modelValue', value);
    };

    return {
      toggle,
    };
  },
});
</script>

<style lang="scss" scoped>
.food-browser-dialog-wrapper {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .food-browser-dialog-content {
    flex-grow: 1;
    flex-basis: calc(100% - 52px);

    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
