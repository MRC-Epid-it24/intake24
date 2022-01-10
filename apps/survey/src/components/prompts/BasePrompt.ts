import Vue, { VueConstructor } from 'vue';
import { FormRefs } from '@intake24/common/types';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import localeContent, { LocaleContent } from '@intake24/survey/components/mixins/localeContent';

export type Prompt = FormRefs & LocaleContent;

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
