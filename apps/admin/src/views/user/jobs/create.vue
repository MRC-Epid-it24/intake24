<template>
  <div>
    <v-card class="mb-4" outlined>
      <v-toolbar flat>
        <v-btn color="white" :title="$t(`common.action.back`)" :to="{ name: 'user.jobs' }">
          <v-icon left>
            $back
          </v-icon>{{ $t(`common.action.back`) }}
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card :flat="isMobile" :outlined="!isMobile" :tile="isMobile">
      <v-tabs background-color="primary" dark>
        <v-tab :key="$t('user.jobs.create')" :title="$t('user.jobs.create')">
          {{ $t('user.jobs.create') }}
        </v-tab>
      </v-tabs>
      <v-container fluid>
        <v-form @keydown.native="clearError" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="6">
              <v-card-title>{{ $t('user.jobs.title') }}</v-card-title>
              <v-card-text>
                <v-select
                  v-model="form.type"
                  hide-details="auto"
                  :items="jobTypeList"
                  :label="$t('user.jobs._')"
                  name="job"
                  outlined
                  prepend-inner-icon="$jobs"
                  @change="updateJob"
                />
              </v-card-text>
            </v-col>
            <v-col cols="12" md="6">
              <component
                :is="form.type"
                v-if="Object.keys(form.params).length"
                v-model="form.params"
                :disabled="disabledJobParams[form.type]"
                :errors="form.errors"
                name="params"
                @input="form.errors.clear(paramErrors)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-6" cols="12" md="6">
              <v-btn
                block
                color="primary"
                :disabled="form.errors.any() || jobInProgress || isAppLoading"
                :title="$t('common.action.upload')"
                type="submit"
                x-large
              >
                <v-icon left>
                  fas fa-play
                </v-icon>{{ $t('common.action.submit') }}
              </v-btn>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }" />
        </v-form>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';

import type { GetJobParams, JobParams, UserJob } from '@intake24/common/types';
import type { JobAttributes } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { jobParams, PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';
import { useForm } from '@intake24/admin/composables';
import { userJobs } from '@intake24/common/types';
import { useI18n } from '@intake24/i18n';

type UserJobForm = {
  type: UserJob;
  params: GetJobParams<UserJob>;
};

export default defineComponent({
  name: 'UserJobsSubmit',

  components: { ...jobParams, PollsJobList },

  mixins: [formMixin],

  setup() {
    const { i18n } = useI18n();

    const jobTypeList = computed(() =>
      userJobs.map(value => ({ value, text: i18n.t(`jobs.types.${value}._`) })),
    );

    const defaultJobsParams = computed<Pick<JobParams, UserJob>>(() => ({
      ResourceExport: { resource: 'as-served-sets' },
    }));

    const disabledJobParams = {
      ResourceExport: {},
    };

    const { clearError, form } = useForm<UserJobForm>({
      data: { type: userJobs[0], params: defaultJobsParams.value[userJobs[0]] },
      config: { resetOnSubmit: false },
    });
    const { jobs, jobInProgress, startPolling } = usePollsForJobs(userJobs);

    const paramErrors = computed(() => Object.keys(form.params).map(key => `params.${key}`));

    onMounted(async () => {
      await startPolling(true);
    });

    const updateJob = () => {
      form.errors.clear();
      form.params = defaultJobsParams.value[form.type];
    };

    const submit = async () => {
      if (jobInProgress.value)
        return;

      const job = await form.post<JobAttributes>(`admin/user/jobs`);

      jobs.value.unshift(job);
      await startPolling();
    };

    return {
      defaultJobsParams,
      disabledJobParams,
      jobTypeList,
      clearError,
      paramErrors,
      form,
      jobs,
      jobInProgress,
      startPolling,
      submit,
      updateJob,
    };
  },
});
</script>

<style lang="scss" scoped></style>
