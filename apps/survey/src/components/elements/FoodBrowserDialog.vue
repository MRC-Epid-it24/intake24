<template>
  <v-dialog
    fullscreen
    transition="dialog-bottom-transition"
    :value="dialog"
    @input="toggle($event)"
  >
    <v-sheet class="food-browser-dialog-wrapper" color="secondary">
      <v-card-title class="flex-grow-0" dark>
        <v-icon color="white" :title="$t('common.action.cancel')" @click="toggle(false)">
          $cancel
        </v-icon>
      </v-card-title>
      <v-card class="food-browser-dialog-content">
        <slot />
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FoodBrowserDialog',

  props: {
    dialog: {
      type: Boolean,
    },
  },

  setup(props, { emit }) {
    const toggle = (value: boolean) => {
      emit('update:dialog', value);
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
