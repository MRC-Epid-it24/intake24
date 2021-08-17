<template>
  <portion-size-option-prompt
    :prompt-props="promptProps"
    :available-methods="availableMethods"
    :food-name="foodName"
    @option-selected="onOptionSelected"
  >
  </portion-size-option-prompt>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { BasePromptProps } from '@common/prompts';
import { EncodedFood } from '@common/types';
import { UserPortionSizeMethod } from '@common/types/http';
import PortionSizeOptionPrompt from '@/components/prompts/portion/PortionSizeOptionPrompt.vue';
import foodPromptUtils from '../mixins/food-prompt-utils';

type Mixins = InstanceType<typeof foodPromptUtils>;

export default (Vue as VueConstructor<Vue & Mixins>).extend({
  name: 'PortionSizeOptionPromptHandler',

  components: { PortionSizeOptionPrompt },

  mixins: [foodPromptUtils],

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  computed: {
    availableMethods(): UserPortionSizeMethod[] {
      return this.encodedSelectedFood.data.portionSizeMethods;
    },
  },

  methods: {
    onOptionSelected(option: number) {
      this.$store.commit('survey/updateFood', {
        mealIndex: this.selectedMealIndex,
        foodIndex: this.selectedFoodIndex,
        update: (state: EncodedFood) => {
          state.portionSizeMethodIndex = option;
        },
      });

      this.$emit('complete');
    },
  },
});
</script>
