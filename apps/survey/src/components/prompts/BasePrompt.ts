import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { MealState } from '@intake24/common/types';
import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import { localeContent } from '@intake24/survey/components/mixins';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export default defineComponent({
  props: {
    meal: {
      type: Object as PropType<MealState>,
    },
  },

  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
