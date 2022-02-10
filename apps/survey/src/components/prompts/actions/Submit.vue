<template>
  <v-btn class="px-5" color="success" x-large :block="isMobile" :title="label">
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
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
