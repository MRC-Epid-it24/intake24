<template>
  <v-btn
    class="px-5"
    color="success"
    large
    :block="isMobile"
    :title="label"
    :disabled="disabled"
    v-on="$listeners"
  >
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PromptActionContinue',

  props: {
    label: {
      type: String,
      default() {
        // Display translated text on button
        return this.$t('common.action.continue');
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
