<template>
  <component :is="promptComponent" :prompt-props="promptProps" @answer="onAnswer"></component>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { mapState } from 'pinia';
import { BasePromptProps } from '@intake24/common/prompts';
import { CustomPromptAnswer } from '@intake24/common/types';
import customPrompts from '@intake24/survey/components/prompts/custom';
import { useSurvey } from '@intake24/survey/stores';

export default defineComponent({
  name: 'CustomPromptHandler',

  components: { ...customPrompts },

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
  },

  setup() {
    const survey = useSurvey();

    return { survey };
  },

  computed: {
    ...mapState(useSurvey, ['selection']),
  },

  methods: {
    onAnswer(answer: CustomPromptAnswer) {
      if (this.selection !== undefined && this.selection.element !== null) {
        // eslint-disable-next-line default-case
        switch (this.selection.element.type) {
          case 'food': {
            if (this.promptComponent === 'info-prompt')
              this.survey.setFoodFlag({
                mealIndex: this.selection.element.mealIndex,
                foodIndex: this.selection.element.foodIndex,
                flag: `${this.promptId}-acknowledged`,
              });
            else
              this.survey.setFoodCustomPromptAnswer({
                mealIndex: this.selection.element.mealIndex,
                foodIndex: this.selection.element.foodIndex,
                promptId: this.promptId,
                answer,
              });
            break;
          }
          case 'meal': {
            if (this.promptComponent === 'info-prompt')
              this.survey.setMealFlag({
                mealIndex: this.selection.element.mealIndex,
                flag: `${this.promptId}-acknowledged`,
              });
            else
              this.survey.setMealCustomPromptAnswer({
                mealIndex: this.selection.element.mealIndex,
                promptId: this.promptId,
                answer,
              });

            break;
          }
        }
      } else if (this.promptComponent === 'info-prompt')
        this.survey.setSurveyFlag(`${this.promptId}-acknowledged`);
      else this.survey.setCustomPromptAnswer({ promptId: this.promptId, answer });

      this.$emit('complete');
    },
  },
});
</script>

<style scoped></style>
