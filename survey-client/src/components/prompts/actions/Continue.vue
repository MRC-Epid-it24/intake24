<template>
  <v-btn class="px-5" color="success" large :block="isMobile" :title="label">
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Continue',

  props: {
    label: {
      type: String,
      default() {
        // Display translated text on button
        return this.$t('common.continue');
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
