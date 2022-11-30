<template>
  <component
    :is="promptComponent"
    :key="promptId"
    v-bind="{
      promptComponent,
      promptProps,
      meal: mealOptional,
      food: foodOptional(),
    }"
    @action="action"
    @update="update"
  ></component>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';

import type { BasePromptProps, CustomComponentType } from '@intake24/common/prompts';
import type { CustomPromptAnswer } from '@intake24/common/types';
import { customPrompts } from '@intake24/survey/components/prompts';
import { useSurvey } from '@intake24/survey/stores';

import { useFoodPromptUtils, useMealPromptUtils } from './mixins';

const infoPrompts = ['info-prompt', 'no-more-information-prompt'];

export default defineComponent({
  name: 'CustomPromptHandler',

  components: { ...customPrompts },

  props: {
    promptComponent: {
      type: String as PropType<CustomComponentType>,
      required: true,
    },
    promptId: {
      type: String,
      required: true,
    },
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
  },

  setup() {
    const { encodedFoodOptional: foodOptional } = useFoodPromptUtils();
    const { mealOptional } = useMealPromptUtils();
    const survey = useSurvey();

    return {
      foodOptional,
      mealOptional,
      survey,
    };
  },

  data() {
    return {
      state: undefined as CustomPromptAnswer | undefined,
    };
  },

  computed: {
    ...mapState(useSurvey, ['selection']),
  },

  methods: {
    ...mapActions(useSurvey, ['setSelection']),

    update(data: { state?: CustomPromptAnswer; valid?: boolean }) {
      const { state, valid } = data;
      this.state = state;

      if (valid !== undefined) this.$emit('valid', valid);
    },

    action(type: string, id?: number) {
      if (type === 'next') this.commitAnswer();

      this.$emit('action', type, id);
    },

    commitAnswer() {
      if (this.state === undefined) {
        console.warn('Did not expect answer to be undefined');
        return;
      }

      if (this.promptComponent === 'no-more-information-prompt') {
        const newSelection = this.selection;
        newSelection.mode = 'auto';
        this.setSelection(newSelection);
      }

      if (this.selection !== undefined && this.selection.element !== null) {
        // eslint-disable-next-line default-case
        switch (this.selection.element.type) {
          case 'food': {
            const food = this.foodOptional();
            if (!food) {
              console.warn('Expected meal to be defined');
              return;
            }

            if (infoPrompts.includes(this.promptComponent))
              this.survey.setFoodFlag({ foodId: food.id, flag: `${this.promptId}-acknowledged` });
            else
              this.survey.setFoodCustomPromptAnswer({
                foodId: food.id,
                promptId: this.promptId,
                answer: this.state,
              });
            break;
          }
          case 'meal': {
            if (!this.mealOptional) {
              console.warn('Expected meal to be defined');
              return;
            }

            if (infoPrompts.includes(this.promptComponent))
              this.survey.setMealFlag({
                mealId: this.mealOptional.id,
                flag: `${this.promptId}-acknowledged`,
              });
            else
              this.survey.setMealCustomPromptAnswer({
                mealId: this.mealOptional.id,
                promptId: this.promptId,
                answer: this.state,
              });

            break;
          }
        }
      } else if (infoPrompts.includes(this.promptComponent)) {
        this.survey.setSurveyFlag(`${this.promptId}-acknowledged`);
      } else {
        this.survey.setCustomPromptAnswer({ promptId: this.promptId, answer: this.state });
      }
    },
  },
});
</script>

<style scoped></style>
