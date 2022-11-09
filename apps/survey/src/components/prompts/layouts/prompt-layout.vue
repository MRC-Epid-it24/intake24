<template>
  <v-card :flat="isMobile" :tile="isMobile">
    <slot name="header">
      <v-sheet class="px-4 pt-4">
        <h3>{{ localeText }}</h3>
        <div v-if="localeDescription" class="mt-4" v-html="localeDescription"></div>
      </v-sheet>
    </slot>
    <v-card-text v-if="hasDefaultSlot">
      <slot></slot>
    </v-card-text>
    <v-card-actions
      v-if="hasActionsSlot"
      class="pa-4 d-flex"
      :class="{ 'flex-column-reverse': isMobile }"
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
  EncodedFood,
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
      type: [Object, String] as PropType<RequiredLocaleTranslation | string>,
      required: true,
    },
    description: {
      type: [Object, String] as PropType<LocaleTranslation | string | null>,
      default: null,
    },
    meal: {
      type: Object as PropType<MealState>,
    },
    food: {
      type: Object as PropType<EncodedFood>,
    },
  },

  computed: {
    localeFoodName() {
      return this.food && this.getLocaleContent(this.food.data.localName);
    },

    localeMealName() {
      return this.meal && this.getLocaleContent(this.meal.name);
    },

    localeText(): string {
      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName } = this;
      if (localeFoodName) params.food = localeFoodName;
      if (localeMealName) params.meal = localeMealName;

      return this.getLocaleContent(this.text, { params });
    },

    localeDescription(): string | null {
      if (!this.description) return null;

      const params: Dictionary<string> = {};
      const { localeFoodName, localeMealName } = this;
      if (localeFoodName) params.food = localeFoodName;
      if (localeMealName) params.meal = localeMealName;

      return this.getLocaleContent(this.description, { params });
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
