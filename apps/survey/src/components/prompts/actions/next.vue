<template>
  <v-btn class="px-4" :color="color" :disabled="disabled" large :title="label" v-on="$listeners">
    <v-icon v-if="icon" left>
      {{ icon }}
    </v-icon>
    <slot>
      {{ $t('recall.actions.next') }}
    </slot>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PromptActionNext',

  props: {
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '$next',
    },
    label: {
      type: String,
      default() {
        return this.$t('recall.actions.next');
      },
    },
  },
});
</script>

<style lang="scss" scoped></style>
