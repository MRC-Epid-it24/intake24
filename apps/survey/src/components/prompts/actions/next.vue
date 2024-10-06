<template>
  <v-btn class="px-4" :color="color" :disabled="disabled" size="large" :title="currentLabel">
    <v-icon v-if="icon" start>
      {{ icon }}
    </v-icon>
    <slot>
      {{ currentLabel }}
    </slot>
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
