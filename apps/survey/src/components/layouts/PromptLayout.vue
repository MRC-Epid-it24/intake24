<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="pa-4">
        <h3 class="mb-4">{{ localeText }}</h3>
        <div v-if="localeDescription" v-html="localeDescription"></div>
      </v-sheet>
    </slot>
    <v-card-text v-if="hasDefaultSlot">
      <slot></slot>
    </v-card-text>
    <v-card-actions
      v-if="hasActionsSlot"
      :class="{ 'flex-column-reverse': isMobile }"
      class="pa-4 d-flex"
    >
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type {
  Dictionary,
  LocaleTranslation,
  MealState,
  RequiredLocaleTranslation,
} from '@intake24/common/types';
import { localeContent } from '@intake24/survey/components/mixins';

export default defineComponent({
  name: 'PromptLayout',

  mixins: [localeContent],

  props: {
    text: {
      type: [Object as () => RequiredLocaleTranslation, String],
      required: true,
    },
    description: {
      type: [Object as () => LocaleTranslation, String],
      default: null,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
  },

  computed: {
    localeMealName(): string | undefined {
      return this.meal ? this.getLocaleContent(this.meal.name).toLocaleLowerCase() : undefined;
    },

    localeText(): string {
      const params: Dictionary<string> = {};
      if (this.localeMealName) params.meal = this.localeMealName;

      return this.getLocaleContent(this.text, { params });
    },

    localeDescription(): string {
      return this.getLocaleContent(this.description);
    },

    hasDefaultSlot(): boolean {
      return !!this.$slots.default;
    },

    hasActionsSlot(): boolean {
      return !!this.$slots.actions;
    },
  },
});
</script>

<style lang="scss" scoped></style>
