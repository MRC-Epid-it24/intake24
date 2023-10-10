<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <review-meal-list
      v-if="!$vuetify.breakpoint.mobile && (showReviewMealListCheckbox || showReviewMealListScroll)"
      v-bind="{ meals, showReviewMealListCheckbox, showReviewMealListScroll }"
      @action="action"
      @reached-bottom="setReachedBottom"
      @update-reviewed="updateReviewed"
    >
    </review-meal-list>
    <review-meal-list-mobile
      v-if="
        $vuetify.breakpoint.mobile &&
        (showReviewMealListMobileCheckbox || showReviewMealListMobileScroll)
      "
      v-bind="{ meals, showReviewMealListMobileCheckbox, showReviewMealListMobileScroll }"
      @action="action"
      @reached-bottom-mobile="setReachedBottomMobile"
      @update-reviewed="updateReviewedMobile"
    >
    </review-meal-list-mobile>
    <template #actions>
      <next :disabled="isValid" @click="action('next')">
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
      <next-mobile :disabled="isValidMobile" @click="action('next')">
        {{ $t('recall.actions.nav.submit') }}
      </next-mobile>
    </template>
  </card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

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

    const reviewed = ref<string[]>([]);

    const reviewedMobile = ref<string[]>([]);

    const reachedBottom = ref<boolean>(false);

    const reachedBottomMobile = ref<boolean>(false);

    const showReviewMealListCheckbox = computed(
      () => props.prompt.review['desktop'] === 'checkbox'
    );

    const showReviewMealListMobileCheckbox = computed(
      () => props.prompt.review['mobile'] === 'checkbox'
    );

    const showReviewMealListScroll = computed(() => props.prompt.review['desktop'] === 'scroll');

    const showReviewMealListMobileScroll = computed(
      () => props.prompt.review['mobile'] === 'scroll'
    );

    const updateReviewed = (newReviewed: string[]) => {
      reviewed.value = newReviewed;
    };

    const updateReviewedMobile = (newReviewed: string[]) => {
      reviewedMobile.value = newReviewed;
    };

    const setReachedBottom = (status: boolean) => {
      reachedBottom.value = status;
    };

    const setReachedBottomMobile = (status: boolean) => {
      reachedBottomMobile.value = status;
    };

    const isValid = computed(() => {
      if (showReviewMealListScroll.value) {
        if (!reachedBottom.value) {
          return true;
        } else {
          return false;
        }
      }

      if (showReviewMealListCheckbox.value) {
        if (props.meals.length !== reviewed.value.length) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });

    const isValidMobile = computed(() => {
      if (showReviewMealListMobileScroll.value) {
        if (!reachedBottomMobile.value) {
          return true;
        } else {
          return false;
        }
      }

      if (showReviewMealListMobileCheckbox.value) {
        if (props.meals.length !== reviewedMobile.value.length) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    });

    return {
      action,
      isValid,
      isValidMobile,
      updateReviewed,
      updateReviewedMobile,
      showReviewMealListCheckbox,
      showReviewMealListMobileCheckbox,
      showReviewMealListScroll,
      showReviewMealListMobileScroll,
      setReachedBottom,
      setReachedBottomMobile,
      reachedBottom,
      reachedBottomMobile,
    };
  },
});
</script>

<style lang="scss" scoped></style>
