<template>
  <guide-image-prompt
    ref="promptHandleChild"
    v-bind="{ foodName, promptProps }"
    :guide-image-id="parameters['guide-image-id']"
    :prompt-component="promptComponent"
    @guide-image-selected="onAnswer"
    @tempChanging="onTempChange"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { PropType } from '@vue/composition-api';
import { mapState, mapActions } from 'pinia';
import { useSurvey } from '@intake24/survey/stores';
import { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import {
  SelectedGuideImageObject,
  HasOnAnswer,
  PromptAnswer,
  PromptHandlerRefs,
} from '@intake24/common/types';
import { GuideImageParameters } from '@intake24/common/types/http';
import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

interface GuideImageData {
  object: SelectedGuideImageObject;
  quantity: QuantityValues;
}

export default (Vue as VueConstructor<Vue & PromptHandlerRefs & Mixins & HasOnAnswer>).extend({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

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

    parameters(): GuideImageParameters {
      if (this.selectedPortionSize.method !== 'guide-image')
        throw new Error('Selected portion size method must be "guide-image"');

      return this.selectedPortionSize.parameters as unknown as GuideImageParameters;
    },
  },

  methods: {
    ...mapActions(useSurvey, ['updateFood', 'setTempPromptAnswer', 'clearTempPromptAnswer']),

    onTempChange(
      tempGuidPromptAnswer: PromptAnswer,
      tempUpdatedGuidPromptAnswer?: Partial<PromptAnswer>
    ) {
      if (tempUpdatedGuidPromptAnswer)
        this.setTempPromptAnswer(tempGuidPromptAnswer, tempUpdatedGuidPromptAnswer);
      else this.setTempPromptAnswer(tempGuidPromptAnswer);
    },

    onAnswer(data: GuideImageData) {
      const { conversionFactor } = this.selectedPortionSize;

      const { selectedMealIndex: mealIndex, selectedFoodIndex: foodIndex } = this;
      if (mealIndex === undefined || foodIndex === undefined) {
        console.warn('No selected meal/food, meal/food index undefined');
        return;
      }

      this.updateFood({
        mealIndex,
        foodIndex,
        food: {
          portionSize: {
            method: 'guide-image',
            servingWeight:
              data.object.weight *
              (data.quantity.whole + data.quantity.fraction) *
              conversionFactor,
            leftoversWeight: 0, // Guide image does not allow estimating leftovers
            object: data.object,
            quantity: data.quantity,
          },
        },
      });

      this.$emit('complete');
      this.clearTempPromptAnswer();
    },

    onPartialAnswer(data: GuideImageData) {
      console.log('Called onPartialAnswer first');
      if (this.currentTempPromptAnswer)
        this.onTempChange(this.currentTempPromptAnswer, { finished: true });
      this.$refs.promptHandleChild?.partialAnswerHandler();
    },
  },
});
</script>
