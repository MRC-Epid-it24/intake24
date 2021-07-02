import Vue, { VueConstructor } from 'vue';
import Continue from '@/components/prompts/actions/Continue.vue';
import PortionLayout from '@/components/layouts/PortionLayout.vue';
import localeContent, { LocaleContent } from '@/components/mixins/localeContent';
import expansionPanelControls, { ExpansionPanelControls } from '@/components/mixins/expansionPanelControls';
import ValidInvalidIcon from '@/components/elements/ValidInvalidIcon.vue';


export type ExpansionPortion = LocaleContent & ExpansionPanelControls;

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  components: { Continue, PortionLayout, ValidInvalidIcon },

  mixins: [localeContent, expansionPanelControls],
});
