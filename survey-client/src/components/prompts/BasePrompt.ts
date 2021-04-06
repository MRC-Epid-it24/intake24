import Vue, { VueConstructor } from 'vue';
import Continue from '@/components/prompts/actions/Continue.vue';
import PromptLayout from '@/components/layouts/PromptLayout.vue';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';
import { FormRefs } from '@common/types';

export type Prompt = FormRefs & LocaleContent;

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  components: { Continue, PromptLayout },

  mixins: [localeContent],
});
