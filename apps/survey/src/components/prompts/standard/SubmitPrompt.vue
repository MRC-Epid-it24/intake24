<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <review-meal-list
      v-if="!$vuetify.breakpoint.mobile && prompt.review['desktop']"
      v-bind="{ meals, review: prompt.review['desktop'] }"
      @action="action"
      @bottom-reached="updateBottomReached('desktop', $event)"
      @reviewed="updateReviewed('desktop', $event)"
    >
    </review-meal-list>
    <review-meal-list-mobile
      v-if="$vuetify.breakpoint.mobile && prompt.review['mobile']"
      v-bind="{ meals, review: prompt.review['mobile'] }"
      @action="action"
      @bottom-reached="updateBottomReached('mobile', $event)"
      @reviewed="updateReviewed('mobile', $event)"
    >
    </review-meal-list-mobile>
    <template #actions>
      <next :disabled="!isValid" @click="action('next')">
        {{ $t('recall.actions.submit') }}
      </next>
    </template>
    <template #nav-actions>
      <v-btn color="primary" text @click.stop="action('addMeal')">
        <span class="text-overline font-weight-medium">
          {{ $t('recall.actions.nav.addMeal') }}
        </span>
        <v-icon class="pb-1">$add</v-icon>
      </v-btn>
      <v-divider vertical></v-divider>
      <next-mobile :disabled="!isValidMobile" @click="action('next')">
        {{ $t('recall.actions.nav.submit') }}
      </next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { PromptLayout } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import { ReviewMealList, ReviewMealListMobile } from '@intake24/survey/components/layouts';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  components: {
    ReviewMealList,
    ReviewMealListMobile,
  },

  mixins: [createBasePrompt<'submit-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
  },

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const bottomReached = ref<Record<PromptLayout, boolean>>({ desktop: false, mobile: false });
    const reviewed = ref<Record<PromptLayout, string[]>>({ desktop: [], mobile: [] });

    const updateBottomReached = (layout: PromptLayout, value: boolean) => {
      bottomReached.value[layout] = value;
    };

    const updateReviewed = (layout: PromptLayout, value: string[]) => {
      reviewed.value[layout] = value;
    };

    const isValid = computed(() => {
      if (props.prompt.review.desktop === 'scroll') return bottomReached.value.desktop;

      if (props.prompt.review.desktop === 'checkbox')
        return props.meals.length === reviewed.value.desktop.length;

      return true;
    });

    const isValidMobile = computed(() => {
      if (props.prompt.review.mobile === 'scroll') return bottomReached.value.mobile;

      if (props.prompt.review.mobile === 'checkbox')
        return props.meals.length === reviewed.value.mobile.length;

      return true;
    });

    return {
      action,
      isValid,
      isValidMobile,
      updateBottomReached,
      updateReviewed,
      bottomReached,
    };
  },
});
</script>

<style lang="scss" scoped></style>
