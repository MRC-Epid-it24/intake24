import Vue from 'vue';
import { formatDate } from '@/util';

export default Vue.extend({
  methods: {
    formatDate(date: Date | string | null, format?: string) {
      if (!date) return date;

      return formatDate(date, format);
    },
  },
});
