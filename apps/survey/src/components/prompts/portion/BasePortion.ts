import type { VueConstructor } from 'vue';
import Vue from 'vue';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import localeContent from '@intake24/survey/components/mixins/localeContent';

export type Portion = LocaleContent;

export default (Vue as VueConstructor<Vue & Portion>).extend({
  components: { Continue, PortionLayout },

  mixins: [localeContent],
});
