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
                hide-details="auto"
                :items="jobTypeList"
                :label="$t('locales.tasks._')"
                name="job"
                outlined
                prepend-inner-icon="fa-running"
                @change="updateJob"
              ></v-select>
            </v-card-text>
          </v-col>
          <v-col cols="12" md="6">
            <component
              :is="form.job"
              v-if="Object.keys(form.params).length"
              v-model="form.params"
              :disabled="disabledJobParams[form.job]"
              :error="form.errors.get('params')"
              name="params"
              :refs="refs"
              @input="form.errors.clear('params')"
            ></component>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="4" sm="6">
            <v-btn
              block
              color="secondary"
              :disabled="form.errors.any() || jobInProgress || isAppLoading"
              :title="$t('common.action.upload')"
              type="submit"
              x-large
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

import type { JobParams, JobType, JobTypeParams } from '@intake24/common/types';
import type { JobEntry, LocaleEntry, LocaleRefs } from '@intake24/common/types/http/admin';
import { formMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { jobParams, PollsForJobs } from '@intake24/admin/components/jobs';
import { form } from '@intake24/admin/helpers';

type LocaleJobType = Extract<
  JobType,
  'LocaleFoodNutrientMapping' | 'PairwiseSearchCopyAssociations'
>;

type LocaleTasksForm = {
  job: LocaleJobType;
  params: JobTypeParams;
};

export default defineComponent({
  name: 'LocaleTasks',

  components: { ...jobParams },

  mixins: [formMixin, PollsForJobs],

  setup(props) {
    const { entry, entryLoaded, refs, refsLoaded } = useStoreEntry<LocaleEntry, LocaleRefs>(
      props.id
    );

    return { entry, entryLoaded, refs, refsLoaded };
  },

  data() {
    const jobType: LocaleJobType[] = [
      'LocaleFoodNutrientMapping',
      'PairwiseSearchCopyAssociations',
    ];
    const jobTypeList = jobType.map((value) => ({ value, text: this.$t(`jobs.types.${value}._`) }));

    const defaultJobsParams: Pick<
      JobParams,
      'LocaleFoodNutrientMapping' | 'PairwiseSearchCopyAssociations'
    > = {
      LocaleFoodNutrientMapping: { localeId: this.id },
      PairwiseSearchCopyAssociations: { sourceLocaleId: '', targetLocaleId: this.id },
    };

    const disabledJobParams = {
      LocaleFoodNutrientMapping: { localeId: true },
      PairwiseSearchCopyAssociations: { targetLocaleId: true },
    };

    return {
      defaultJobsParams,
      disabledJobParams,
      form: form<LocaleTasksForm>(
        {
          job: jobType[0],
          params: defaultJobsParams.LocaleFoodNutrientMapping,
        },
        { resetOnSubmit: false }
      ),
      jobType,
      jobTypeList,
    };
  },

  async mounted() {
    await this.startPolling(true);
  },

  methods: {
    updateJob() {
      this.form.errors.clear('job');
      this.form.params = this.defaultJobsParams[this.form.job];
    },

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
