import { defineComponent } from 'vue';
import { PollsForJobs } from '@intake24/admin/components/polls-for-jobs';

export default defineComponent({
  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  mixins: [PollsForJobs],

  data() {
    return {
      dialog: false,
    };
  },

  watch: {
    async dialog(val: boolean) {
      if (!val) {
        this.stopPolling();
        return;
      }

      await this.status();
    },
  },

  methods: {
    close() {
      this.dialog = false;
    },
  },
});
