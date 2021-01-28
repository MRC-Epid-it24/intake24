<template>
  <v-card-actions class="mt-3">
    <v-btn class="px-5" color="success" large type="submit" :block="isMobile" :title="label">
      {{ label }}
    </v-btn>
  </v-card-actions>
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
