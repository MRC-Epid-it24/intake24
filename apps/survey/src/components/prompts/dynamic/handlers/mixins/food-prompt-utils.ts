import { defineComponent } from '@vue/composition-api';
import { mapGetters } from 'vuex';
import { EncodedFood, LocaleTranslation } from '@intake24/common/types';
import { UserPortionSizeMethod } from '@intake24/common/types/http';

export default defineComponent({
  computed: {
    ...mapGetters('survey', ['selectedFood', 'selectedMealIndex', 'selectedFoodIndex']),

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
