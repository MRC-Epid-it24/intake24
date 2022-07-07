import { defineComponent } from 'vue';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import localeContent from '@intake24/survey/components/mixins/localeContent';

export default defineComponent({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
