<template>
  <v-btn :block="isMobile" class="px-5" color="success" :title="label" x-large>
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PromptActionSubmit',

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
