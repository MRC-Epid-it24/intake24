import { defineComponent } from '@vue/composition-api';
import { JobEntry } from '@intake24/common/types/http/admin';
import { JobType } from '@intake24/common/types';
import { downloadFile } from '@intake24/admin/util/fs';
import PollsJobList from './polls-job-list.vue';

export default defineComponent({
  components: { PollsJobList },

  data() {
    return {
      jobType: [] as JobType | JobType[],
      jobs: [] as JobEntry[],
      polling: null as number | null,
    };
  },

  computed: {
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
      } = await this.$http.get(`admin/user/jobs`, { params: { type: this.jobType, limit: 5 } });

      this.jobs = [...data];
    },

    async startPolling(now = false, ms = 2000) {
      if (now) await this.status();

      this.polling = setInterval(async () => {
        await this.status();
      }, ms);
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
