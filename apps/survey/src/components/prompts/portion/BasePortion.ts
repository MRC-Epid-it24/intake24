import { defineComponent } from 'vue';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import localeContent from '@intake24/survey/components/mixins/localeContent';

export type Portion = LocaleContent;

export default defineComponent({
  components: { Continue, PortionLayout },

  mixins: [localeContent],
});
