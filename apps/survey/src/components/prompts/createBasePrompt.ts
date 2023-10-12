import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { Prompt, Prompts } from '@intake24/common/prompts';
import type { PromptSection } from '@intake24/common/surveys';
import type { EncodedFood, FoodState, MealState } from '@intake24/common/types';

import { Next, NextMobile } from './actions';
import { BaseLayout, CardLayout } from './layouts';

// use prompt macros in vue3
export default <P extends keyof Prompts, F extends FoodState = EncodedFood>() =>
  defineComponent({
    name: 'BasePrompt',

    components: { Next, NextMobile, BaseLayout, CardLayout },

    props: {
      food: {
        type: Object as PropType<F>,
      },
      meal: {
        type: Object as PropType<MealState>,
      },
      prompt: {
        type: Object as PropType<Prompts[P]>,
        required: true,
      },
      section: {
        type: String as PropType<PromptSection>,
        required: true,
      },
    },
  });
