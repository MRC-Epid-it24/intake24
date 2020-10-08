<template>
  <v-card-actions class="mt-3">
    <v-btn class="px-5" color="success" x-large type="submit" :block="isMobile" :title="label">
      {{ label }}
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Submit',

  props: {
    label: {
      type: String,
      default() {
        return this.$t('recall.submit');
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
