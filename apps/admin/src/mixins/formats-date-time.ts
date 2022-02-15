import { defineComponent } from '@vue/composition-api';
import { formatDate } from '@intake24/admin/util';

export default defineComponent({
  methods: {
    formatDate(date: Date | string | null, format?: string) {
      if (!date) return date;

      return formatDate(date, format);
    },
  },
});
