<template>
  <div class="d-flex justify-center align-center">
    <v-card
      :class="{ 'mt-10': $vuetify.breakpoint.smAndUp }"
      :max-width="$vuetify.breakpoint.xs ? $vuetify.breakpoint.thresholds.xs : maxWidth"
      :tile="$vuetify.breakpoint.xs"
    >
      <div class="d-flex justify-center align-center py-4">
        <slot name="logo">
          <v-avatar v-if="hasIcon" tile>
            <img alt="logo" :src="iconFile">
          </v-avatar>
        </slot>
        <slot name="title">
          <v-card-title class="text-h2 font-weight-medium justify-center">
            {{ title }}
          </v-card-title>
        </slot>
      </div>
      <slot name="subtitle">
        <v-card-subtitle class="text-center font-weight-medium px-6 py-0">
          {{ subtitle }}
        </v-card-subtitle>
      </slot>
      <slot />
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { iconPrimary } from '@intake24/common/theme/assets';

export default defineComponent({
  name: 'EntryScreen',

  props: {
    icon: {
      type: [Boolean, String],
      default: true,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    maxWidth: {
      type: String,
      default: '30rem',
    },
  },

  setup(props) {
    const hasIcon = computed(() => typeof props.icon === 'string' || props.icon);
    const iconFile = computed(() => (typeof props.icon === 'string' ? props.icon : iconPrimary));

    return {
      hasIcon,
      iconFile,
    };
  },
});
</script>

<style lang="scss"></style>
