import Vue from 'vue';
import { JobEntry } from '@common/types/http/admin/jobs';

export default Vue.extend({
  data() {
    return {
      dialog: false,
      jobType: null as string | null,
      jobs: [] as JobEntry[],
      polling: null as number | null,
    };
  },

  computed: {
    surveyId(): string {
      return this.$route.params.id;
    },
    visibleJobs(): JobEntry[] {
      return this.jobs.length > 5 ? this.jobs.slice(0, 5) : this.jobs;
    },
    jobInProgress(): boolean {
      return this.jobs.some((item) => item.progress !== 1);
    },
  },

  watch: {
    async dialog(val: boolean) {
      if (!val) {
        this.stopPolling();
        return;
      }

      await this.status();
    },
    jobs(val: JobEntry[]) {
      const done = val.every((item) => item.progress === 1);

      if (!val.length || done) this.stopPolling();
    },
  },

  beforeDestroy() {
    this.stopPolling();
  },

  methods: {
    close() {
      this.dialog = false;
    },

    async status() {
      const {
        data: { data },
      } = await this.$http.get(`admin/jobs`, { params: { type: this.jobType } });

      this.jobs = [...data];
    },

    async startPolling() {
      this.polling = setInterval(async () => {
        await this.status();
      }, 2000);
    },

    stopPolling() {
      if (this.polling !== null) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },
  },
});
