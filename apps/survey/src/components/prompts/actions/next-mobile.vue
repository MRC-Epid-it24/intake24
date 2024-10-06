<template>
  <v-btn :color="color" :disabled="disabled" :title="currentLabel">
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
import { computed, defineComponent } from 'vue';

import { useI18n } from '@intake24/i18n';

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
    },
  },

  setup(props) {
    const { i18n: { t } } = useI18n();

    const currentLabel = computed(() => props.label ?? t('recall.actions.next'));

    return { currentLabel };
  },
});
</script>

<style lang="scss" scoped></style>
