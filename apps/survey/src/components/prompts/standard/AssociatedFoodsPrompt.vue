<template>
  <prompt-layout :text="text" :description="description">
    {{ this.foodName }}

    {{ this.associatedFood.categoryCode }}

    {{ this.associatedFood.foodCode }}
  </prompt-layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapState } from 'pinia';
import { PropType } from '@vue/composition-api';
import { BasePromptProps, MealTimePromptProps } from '@intake24/common/prompts';
import { useSurvey } from '@intake24/survey/stores';
import { UserAssociatedFoodPrompt } from '@intake24/common/types/http';
import BasePrompt, { Prompt } from '../BasePrompt';

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  name: 'AssociatedFoodsPrompt',

  mixins: [BasePrompt],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    foodName: {
      type: String,
    },
    associatedFood: {
      type: Object as PropType<UserAssociatedFoodPrompt>,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      errors: [] as string[],
    };
  },

  computed: {
    ...mapState(useSurvey, ['selectedMealIndex', 'selectedFoodIndex', 'currentTempPromptAnswer']),
    text(): string {
      const text = this.promptProps.text[this.$i18n.locale];
      return text
        ? text.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.text', { meal: this.foodName }).toString();
    },
    description(): string {
      const description = this.promptProps.description[this.$i18n.locale];
      return description
        ? description.replace('{food}', this.foodName ?? '')
        : this.$t('prompts.associatedFoods.description', { meal: this.foodName }).toString();
    },
  },

  methods: {
    submit() {
      this.$emit('answer', null);
    },
  },
});
</script>

<style lang="scss" scoped></style>
