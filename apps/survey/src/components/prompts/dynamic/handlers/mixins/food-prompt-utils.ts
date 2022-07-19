import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import type { EncodedFood, LocaleTranslation } from '@intake24/common/types';
import type { UserPortionSizeMethod } from '@intake24/common/types/http';
import { useSurvey } from '@intake24/survey/stores';

const mixin = defineComponent({
  computed: {
    ...mapState(useSurvey, ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

    selectedFoodIndexRequired(): number {
      const foodIndex = this.selectedFoodIndex;

      if (foodIndex === undefined) throw new Error('A food must be selected at this point');

      return foodIndex;
    },

    encodedSelectedFood(): EncodedFood {
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
        en: this.encodedSelectedFood.data.englishName,
      };
    },

    selectedPortionSize(): UserPortionSizeMethod {
      const selectedFood = this.encodedSelectedFood;

      if (selectedFood.portionSizeMethodIndex === null)
        throw new Error('This prompt requires a portion size option to be selected');

      return selectedFood.data.portionSizeMethods[selectedFood.portionSizeMethodIndex];
    },
  },
});

export type FoodPromptUtilsType = InstanceType<typeof mixin>;

export default mixin;
