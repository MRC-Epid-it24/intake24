<template>
  <guide-image-prompt
    v-bind="{ foodName, promptProps }"
    :guide-image-id="parameters['guide-image-id']"
    @guide-image-selected="onGuideImageSelected"
  >
  </guide-image-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { BasePromptProps, QuantityValues } from '@intake24/common/prompts';
import { EncodedFood, SelectedGuideImageObject } from '@intake24/common/types';
import { GuideImageParameters } from '@intake24/common/types/http';
import GuideImagePrompt from '@intake24/survey/components/prompts/portion/GuideImagePrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

interface GuideImageData {
  object: SelectedGuideImageObject;
  quantity: QuantityValues;
}

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'GuideImagePromptHandler',

  components: { GuideImagePrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
  },

  computed: {
    parameters(): GuideImageParameters {
      if (this.selectedPortionSize.method !== 'guide-image')
        throw new Error('Selected portion size method must be "guide-image"');

      return this.selectedPortionSize.parameters as unknown as GuideImageParameters;
    },
  },

  methods: {
    onGuideImageSelected(data: GuideImageData) {
      const { conversionFactor } = this.selectedPortionSize;

      this.$store.commit('survey/updateFood', {
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        update: (state: EncodedFood) => {
          state.portionSize = {
            method: 'guide-image',
            servingWeight:
              data.object.weight *
              (data.quantity.whole + data.quantity.fraction) *
              conversionFactor,
            leftoversWeight: 0, // Guide image does not allow estimating leftovers
            object: data.object,
            quantity: data.quantity,
          };
        },
      });

      this.$emit('complete');
    },
  },
});
</script>
