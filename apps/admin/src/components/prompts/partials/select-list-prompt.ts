import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { LocaleOptionList } from '@intake24/common/types';
import { LanguageSelector } from '@intake24/admin/components/forms';
import { OptionsList } from '@intake24/admin/components/lists';

import basePrompt from './base-prompt';

export default defineComponent({
  name: 'SelectListPrompt',

  components: { OptionsList, LanguageSelector },

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
