<template>
  <v-btn class="px-5" color="success" large :block="isMobile" :title="label" v-on="$listeners">
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'Continue',

  props: {
    label: {
      type: String,
      default() {
        // Display translated text on button
        return this.$t('common.action.continue');
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
