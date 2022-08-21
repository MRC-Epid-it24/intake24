<template>
  <layout v-bind="{ id, entry }">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title>{{ $t('locales.tasks.title') }}</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.job"
                :items="jobTypeList"
                :label="$t('locales.tasks._')"
                hide-details="auto"
                name="job"
                outlined
                prepend-icon="fa-running"
                @change="form.errors.clear('job')"
              ></v-select>
            </v-card-text>
          </v-col>
          <v-col cols="12" md="6">
            <component
              :is="form.job"
              v-if="Object.keys(form.params).length"
              v-model="form.params"
              :error="form.errors.get('params')"
              :refs="refs"
              name="params"
              @input="form.errors.clear('params')"
            ></component>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4">
            <v-btn
              :disabled="form.errors.any() || jobInProgress || isAppLoading"
              block
              x-large
              type="submit"
              color="secondary"
              :title="$t('common.action.upload')"
            >
              <v-icon left>fa-play</v-icon> {{ $t('common.action.submit') }}
            </v-btn>
          </v-col>
        </v-row>
        <polls-job-list v-bind="{ jobs }"></polls-job-list>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobType, JobTypeParams } from '@intake24/common/types';
import type { JobEntry, LocaleEntry } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { jobParams, PollsForJobs } from '@intake24/admin/components/jobs';
import { form } from '@intake24/admin/helpers';
import { defaultJobsParams } from '@intake24/common/types';

type LocaleTasksForm = {
  job: string;
  params: JobTypeParams;
};

export default defineComponent({
  name: 'LocaleTasks',

  components: { ...jobParams },

  mixins: [formMixin, PollsForJobs],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<LocaleEntry>(props.id);

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    const jobType: JobType[] = ['LocaleCopyPairwiseAssociations'];
    const jobTypeList = jobType.map((value) => ({ value, text: this.$t(`jobs.types.${value}._`) }));

    return {
      form: form<LocaleTasksForm>({
        job: jobTypeList[0].value,
        params: defaultJobsParams[jobTypeList[0].value],
      }),
      jobType,
      jobTypeList,
    };
  },

  async mounted() {
    await this.startPolling(true);
  },

  methods: {
    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(`admin/locales/${this.id}/tasks`);

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
