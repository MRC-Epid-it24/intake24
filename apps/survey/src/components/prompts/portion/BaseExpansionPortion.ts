import type { VueConstructor } from 'vue';
import Vue from 'vue';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';
import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import type { LocaleContent } from '@intake24/survey/components/mixins/localeContent';
import localeContent from '@intake24/survey/components/mixins/localeContent';
import type { ExpansionPanelControls } from '@intake24/survey/components/mixins/expansionPanelControls';
import expansionPanelControls from '@intake24/survey/components/mixins/expansionPanelControls';
import ValidInvalidIcon from '@intake24/survey/components/elements/ValidInvalidIcon.vue';

export type ExpansionPortion = LocaleContent & ExpansionPanelControls;

export default (Vue as VueConstructor<Vue & ExpansionPortion>).extend({
  components: { Continue, PortionLayout, ValidInvalidIcon },

  mixins: [localeContent, expansionPanelControls],
});
