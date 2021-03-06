import Vue from 'vue';
import { LocaleTranslation, LocaleOptionList } from '@common/types';
import prompt from './Prompt';
import PromptListOptions from './PromptListOptions.vue';
import LanguageSelector from './LanguageSelector.vue';

export default Vue.extend({
  name: 'SelectListPrompt',

  components: { PromptListOptions, LanguageSelector },

  mixins: [prompt],

  props: {
    options: {
      type: Object as () => LocaleOptionList,
    },
    label: {
      type: Object as () => LocaleTranslation,
    },
    other: {
      type: Boolean,
      default: true,
    },
  },
});
