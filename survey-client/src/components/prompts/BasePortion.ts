import Vue, { VueConstructor } from 'vue';
import Continue from '@/components/Continue.vue';
import PortionLayout from '@/components/layouts/PortionLayout.vue';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';
import { FormRefs } from '@common/types/common';

export type Prompt = FormRefs & LocaleContent;

export default (Vue as VueConstructor<Vue & Prompt>).extend({
  components: { Continue, PortionLayout },

  mixins: [localeContent],
});
