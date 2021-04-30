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
import Vue from 'vue';
import MealAddPrompt from '@/components/prompts/standard/MealAddPrompt.vue';
import { BasePromptProps } from '@common/prompts';
import { EncodedFood, FoodState, LocaleTranslation, Meal } from '@common/types';
import { mapGetters } from 'vuex';
import PortionSizeOptionPrompt from '@/components/prompts/portion/PortionSizeOptionPrompt.vue';
import { UserPortionSizeMethod } from '@common/types/http';

export default Vue.extend({
  name: 'PortionSizeOptionPromptHandler',
  components: { PortionSizeOptionPrompt },

  props: {
    promptProps: {
      type: Object as () => BasePromptProps,
    },
  },

  computed: {
    ...mapGetters('survey', ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

    validatedSelectedFood(): EncodedFood {
      const { selectedFood } = this;

      if (selectedFood === undefined) throw new Error('This prompt requires a food to be selected');

      if (selectedFood.type !== 'encoded-food')
        throw new Error('This selected food must be an encoded food');

      return selectedFood;
    },

    // FIXME: local food names need to be returned for all locales from food data service,
    // en is hard-coded for now
    foodName(): LocaleTranslation {
      return {
        en: this.validatedSelectedFood.data.englishDescription,
      };
    },

    availableMethods(): UserPortionSizeMethod[] {
      return this.validatedSelectedFood.data.portionSizeMethods;
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
