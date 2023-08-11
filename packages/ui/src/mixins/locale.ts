import { defineComponent } from 'vue';

import { translate } from '@intake24/i18n';

export default defineComponent({
  methods: {
    $ti: translate,
  },
});
