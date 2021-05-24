import Vue from 'vue';
import { JobEntry } from '@common/types/http/admin';
import { downloadFile } from '@/util/fs';

export default Vue.extend({
  data() {
    return {
      jobType: null as string | null,
      jobs: [] as JobEntry[],
      polling: null as number | null,
    };
  },

  computed: {
    visibleJobs(): JobEntry[] {
      return this.jobs.length > 5 ? this.jobs.slice(0, 5) : this.jobs;
    },
    jobInProgress(): boolean {
      return this.jobs.some((item) => item.progress !== 1);
    },
  },

  watch: {
    jobs(val: JobEntry[]) {
      const done = val.every((item) => item.progress === 1);

      if (!val.length || done) this.stopPolling();
    },
  },

  beforeDestroy() {
    this.stopPolling();
  },

  methods: {
    async status() {
      const {
        data: { data },
      } = await this.$http.get(`admin/user/jobs`, { params: { type: this.jobType } });

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

    async download(job: JobEntry) {
      const res = await this.$http.get(`admin/user/jobs/${job.id}/download`, {
        responseType: 'blob',
      });
      downloadFile(res, job.downloadUrl);
    },
  },
});
