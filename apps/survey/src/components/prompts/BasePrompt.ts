import type { VueConstructor } from 'vue';
import Vue from 'vue';
import type { FormRefs } from '@intake24/common/types';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PromptLayout from '@intake24/survey/components/layouts/PromptLayout.vue';
import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import localeContent from '@intake24/survey/components/mixins/localeContent';

export type Prompt = FormRefs & LocaleContent;

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
