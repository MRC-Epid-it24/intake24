<template>
  <as-served-prompt
    v-bind="{ foodName, promptProps }"
    :as-served-set-id="parameters['leftovers-image-set']"
    @as-served-selected="onAsServedSelected"
  ></as-served-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { BasePromptProps } from '@intake24/common/prompts';
import { EncodedFood, SelectedAsServedImage } from '@intake24/common/types';
import { AsServedParameters } from '@intake24/common/types/http';
import AsServedPrompt from '@intake24/survey/components/prompts/portion/AsServedPrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'AsServedPromptHandler',

  components: { AsServedPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
      required: true,
    },
  },

  computed: {
    parameters(): AsServedParameters {
      if (this.selectedPortionSize.method !== 'as-served')
        throw new Error('Selected portion size method must be "as-served"');

      return this.selectedPortionSize.parameters as unknown as AsServedParameters;
    },
  },

  methods: {
    onAsServedSelected(selected: SelectedAsServedImage) {
      const { conversionFactor } = this.selectedPortionSize;

      this.$store.commit('survey/updateFood', {
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        update: (state: EncodedFood) => {
          state.portionSize = {
            method: 'as-served',
            serving:
              state.portionSize?.method === 'as-served' ? state.portionSize?.serving ?? null : null,
            leftovers: selected,
            servingWeight: state.portionSize?.servingWeight ?? null,
            leftoversWeight: selected.weight * conversionFactor,
          };
        },
      });

      this.$emit('complete');
    },
  },
});
</script>
