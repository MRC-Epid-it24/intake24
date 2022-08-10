import { defineComponent } from 'vue';

import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import { localeContent } from '@intake24/survey/components/mixins';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export default defineComponent({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
