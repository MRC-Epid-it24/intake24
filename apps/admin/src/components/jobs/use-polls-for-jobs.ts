import { computed, onBeforeUnmount, ref, watch } from 'vue';

import type { JobType } from '@intake24/common/types';
import type { JobEntry } from '@intake24/common/types/http/admin';
import { useHttp } from '@intake24/admin/services';

export const usePollsForJobs = (jobType: JobType | JobType[]) => {
  const http = useHttp();

  const dialog = ref<boolean>(false);
  const jobs = ref<JobEntry[]>([]);
  const polling = ref<number | null>(null);

  const jobInProgress = computed(() => jobs.value.some((item) => item.progress !== 1));

  watch(jobs, (val: JobEntry[]) => {
    const done = val.every((item) => item.progress === 1);

    if (!val.length || done) stopPolling();
  });

  watch(dialog, async (val: boolean) => {
    if (!val) {
      stopPolling();
      return;
    }

    await status();
  });

  onBeforeUnmount(() => {
    stopPolling();
  });

  const status = async () => {
    const {
      data: { data },
    } = await http.get(`admin/user/jobs`, { params: { type: jobType, limit: 5 } });

    jobs.value = [...data];
  };

  const startPolling = async (now = false, ms = 2000) => {
    if (now) await status();

    if (polling.value !== null) return;

    polling.value = setInterval(async () => {
      await status();
    }, ms);
  };

  const stopPolling = () => {
    if (polling.value !== null) {
      clearInterval(polling.value);
      polling.value = null;
    }
  };

  return {
    dialog,
    jobs,
    polling,
    jobInProgress,
    status,
    startPolling,
    stopPolling,
  };
};
