import type { VueConstructor } from 'vue';
import Vue from 'vue';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import localeContent from '@intake24/survey/components/mixins/localeContent';

export default (Vue as VueConstructor<Vue & LocaleContent>).extend({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
