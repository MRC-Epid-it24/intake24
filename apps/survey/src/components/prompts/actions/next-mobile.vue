<template>
  <v-btn :color="color" :disabled="disabled" :title="label" v-on="$listeners">
    <span class="text-overline font-weight-medium">
      <slot>
        {{ $t('recall.actions.next') }}
      </slot>
    </span>
    <v-icon v-if="icon" class="pb-1">
      {{ icon }}
    </v-icon>
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
