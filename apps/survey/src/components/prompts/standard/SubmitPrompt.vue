<template>
  <submit-card-layout v-bind="{ food, meal, prompt, section, isValid }" @action="action">
    <review-meal-list
      v-if="$vuetify.breakpoint.lgAndUp"
      v-bind="{ meals }"
      @update-reviewed="updateReviewed"
    ></review-meal-list>
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
    </template>
  </submit-card-layout>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref } from 'vue';

import type { MealState } from '@intake24/common/types';
import { ReviewMealList } from '@intake24/survey/components/layouts';
import { usePromptUtils } from '@intake24/survey/composables';

import createBasePrompt from '../createBasePrompt';

export default defineComponent({
  name: 'SubmitPrompt',

  components: { ReviewMealList },

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

    const updateReviewed = (newReviewed: string[]) => {
      reviewed.value = newReviewed;
    };

    const isValid = computed(() => props.meals.length != reviewed.value.length);

    return { action, isValid, updateReviewed };
  },
});
</script>

<style lang="scss" scoped></style>
