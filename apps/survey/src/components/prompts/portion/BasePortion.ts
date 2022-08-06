import { defineComponent } from 'vue';

import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export type Portion = LocaleContent;

export default defineComponent({
  components: { Continue, PortionLayout },

  mixins: [localeContent],
});
