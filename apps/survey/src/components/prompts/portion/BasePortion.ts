import { defineComponent } from 'vue';

import PortionLayout from '@intake24/survey/components/layouts/PortionLayout.vue';
import { localeContent } from '@intake24/survey/components/mixins';
import Continue from '@intake24/survey/components/prompts/actions/Continue.vue';

export default defineComponent({
  components: { Continue, PortionLayout },

  mixins: [localeContent],
});
