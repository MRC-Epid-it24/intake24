<template>
  <as-served-prompt
    v-bind="{ foodName, promptProps }"
    :as-served-set-id="parameters['serving-image-set']"
    :prompt-component="promptComponent"
    @as-served-selected="onAnswer"
    @tempChanging="onTempChange"
  ></as-served-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { mapState, mapActions } from 'pinia';
import { BasePromptProps } from '@intake24/common/prompts';
import {
  SelectedAsServedImage,
  HasOnAnswer,
  PromptAnswer,
  PromptHandlerRefs,
  FoodState,
} from '@intake24/common/types';
import { AsServedParameters } from '@intake24/common/types/http';
import AsServedPrompt from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import { useSurvey } from '@intake24/survey/stores';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

export default (Vue as VueConstructor<Vue & PromptHandlerRefs & Mixins & HasOnAnswer>).extend({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as PropType<BasePromptProps>,
      required: true,
    },
    promptComponent: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState(useSurvey, ['currentTempPromptAnswer']),

    parameters(): AsServedParameters {
      if (this.selectedPortionSize.method !== 'as-served')
        throw new Error('Selected portion size method must be "as-served"');

      return this.selectedPortionSize.parameters as unknown as AsServedParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, [
      'updateFood',
      'updateFoodCallback',
      'setTempPromptAnswer',
      'clearTempPromptAnswer',
    ]),

    onTempChange(
      tempGuidPromptAnswer: PromptAnswer,
      tempUpdatedGuidPromptAnswer?: Partial<PromptAnswer>
    ) {
      if (tempUpdatedGuidPromptAnswer)
        this.setTempPromptAnswer(tempGuidPromptAnswer, tempUpdatedGuidPromptAnswer);
      else this.setTempPromptAnswer(tempGuidPromptAnswer);
    },

    onAnswer(selected: SelectedAsServedImage) {
      const { conversionFactor } = this.selectedPortionSize;

      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.warn('No selected meal/food, meal/food index undefined');
        return;
      }
      console.log('This is sstate: ', selected);
      this.updateFoodCallback({
        mealIndex,
        foodIndex,
        update: (state: FoodState) => {
          if (state.type === 'encoded-food') {
            state.portionSize = {
              method: 'as-served',
              serving:
                state.portionSize?.method === 'as-served'
                  ? state.portionSize?.serving ?? null
                  : null,
              leftovers: selected,
              servingWeight: state.portionSize?.servingWeight ?? null,
              leftoversWeight: selected.weight * conversionFactor,
            };
          }
        },
      });

      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onPartialAnswer(data: SelectedAsServedImage) {
      console.log('Called onPartialAnswer first');
      // if (this.currentTempPromptAnswer?.response)
      //   this.onTempChange(this.currentTempPromptAnswer, { finished: true });
      this.$refs.promptHandleChild?.partialAnswerHandler();
    },
  },
});
</script>
