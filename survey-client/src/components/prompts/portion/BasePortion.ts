import Vue, { VueConstructor } from 'vue';
import PortionLayout from '@/components/layouts/PortionLayout.vue';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';

export type Portion = LocaleContent;

export default (Vue as VueConstructor<Vue & Portion>).extend({
  components: { PortionLayout },

  mixins: [localeContent],
});
