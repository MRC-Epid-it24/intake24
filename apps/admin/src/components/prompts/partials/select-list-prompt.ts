import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { LocaleOptionList } from '@intake24/common/prompts';
import { LanguageSelector } from '@intake24/admin/components/forms';

import basePrompt from './base-prompt';
import PromptListOptions from './prompt-list-options.vue';

export default defineComponent({
  name: 'SelectListPrompt',

  components: { PromptListOptions, LanguageSelector },

  mixins: [basePrompt],

  props: {
    options: {
      type: Object as PropType<LocaleOptionList>,
      required: true,
    },
    other: {
      type: Boolean,
      required: true,
    },
  },
});
