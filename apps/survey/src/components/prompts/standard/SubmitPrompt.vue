<template>
  <card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <review-meal-list
      v-if="!$vuetify.breakpoint.mobile && showReviewMealListCheckbox"
      v-bind="{ meals }"
      @action="action"
      @update-reviewed="updateReviewed"
    >
    </review-meal-list>
    <review-meal-list-scroll
      v-if="!$vuetify.breakpoint.mobile && showReviewMealListScroll"
      v-bind="{ meals }"
      @action="action"
      @reached-bottom="setReachedBottom"
    >
    </review-meal-list-scroll>
    <review-meal-list-mobile
      v-if="$vuetify.breakpoint.mobile && showReviewMealListMobileCheckbox"
      v-bind="{ meals }"
      @action="action"
      @update-reviewed="updateReviewedMobile"
    >
    </review-meal-list-mobile>
    <review-meal-list-mobile-scroll
      v-if="$vuetify.breakpoint.mobile && showReviewMealListMobileScroll"
      v-bind="{ meals }"
      @action="action"
      @reached-bottom-mobile="setReachedBottomMobile"
    >
    </review-meal-list-mobile-scroll>
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

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { MealState } from '@intake24/common/types';
import {
  ReviewMealList,
  ReviewMealListMobile,
  ReviewMealListMobileScroll,
  ReviewMealListScroll,
} from '@intake24/survey/components/layouts';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  components: {
    ReviewMealList,
    ReviewMealListMobile,
    ReviewMealListScroll,
    ReviewMealListMobileScroll,
  },

  mixins: [createBasePrompt<'submit-prompt'>()],

  props: {
    meals: {
      type: Array as PropType<MealState[]>,
      required: true,
    },
    prompt: {
      type: Object as PropType<Prompt>,
      required: true,
    },
    review: {
      type: Object as PropType<Prompts['submit-prompt']['review']>,
    },
  },

  setup(props, ctx) {
    const { action } = usePromptUtils(props, ctx);

    const reviewed = ref<string[]>([]);

    const reviewedMobile = ref<string[]>([]);

    const isValid = ref<boolean>(false);

    const isValidMobile = ref<boolean>(false);

    const reachedBottom = ref<boolean>(false);

    const reachedBottomMobile = ref<boolean>(false);

    const showReviewMealListCheckbox = computed(() => {
      if (
        props.prompt.component === 'submit-prompt' &&
        props.prompt.review['desktop'] === 'checkbox'
      ) {
        return true;
      } else {
        return false;
      }
    });

    const showReviewMealListMobileCheckbox = computed(() => {
      if (
        props.prompt.component === 'submit-prompt' &&
        props.prompt.review['mobile'] === 'checkbox'
      ) {
        return true;
      } else {
        return false;
      }
    });

    const showReviewMealListScroll = computed(() => {
      if (
        props.prompt.component === 'submit-prompt' &&
        props.prompt.review['desktop'] === 'scroll'
      ) {
        return true;
      } else {
        return false;
      }
    });

    const showReviewMealListMobileScroll = computed(() => {
      if (
        props.prompt.component === 'submit-prompt' &&
        props.prompt.review['mobile'] === 'scroll'
      ) {
        return true;
      } else {
        return false;
      }
    });

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

    watch(
      [
        reviewed,
        reviewedMobile,
        props.meals,
        showReviewMealListCheckbox,
        showReviewMealListMobileCheckbox,
        showReviewMealListScroll,
        showReviewMealListMobileScroll,
        reachedBottom,
        reachedBottomMobile,
      ],
      () => {
        if (showReviewMealListScroll.value) {
          if (!reachedBottom.value) {
            isValid.value = true;
          } else {
            isValid.value = false;
          }
        }

        if (showReviewMealListCheckbox.value) {
          if (props.meals.length !== reviewed.value.length) {
            isValid.value = true;
          } else {
            isValid.value = false;
          }
        }

        if (showReviewMealListMobileScroll.value) {
          if (!reachedBottomMobile.value) {
            isValidMobile.value = true;
          } else {
            isValidMobile.value = false;
          }
        }

        if (showReviewMealListMobileCheckbox.value) {
          if (props.meals.length !== reviewedMobile.value.length) {
            isValidMobile.value = true;
          } else {
            isValidMobile.value = false;
          }
        }
      },
      { immediate: true }
    );

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
