import { defineComponent } from 'vue';

import expansionPanelControls from '@intake24/survey/components/mixins/expansionPanelControls';

import BasePortion from './BasePortion';

export default defineComponent({
  name: 'BaseExpansionPortion',

  mixins: [BasePortion, expansionPanelControls],
});
