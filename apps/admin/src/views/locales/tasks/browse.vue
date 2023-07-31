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
                prepend-inner-icon="$jobs"
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
              :errors="form.errors.get('params')"
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
              <v-icon left>fa-play</v-icon>{{ $t('common.action.submit') }}
            </v-btn>
          </v-col>
        </v-row>
        <polls-job-list v-bind="{ jobs }"></polls-job-list>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import type { JobParams, JobType, JobTypeParams } from '@intake24/common/types';
import type { JobEntry, LocaleEntry, LocaleRefs } from '@intake24/common/types/http/admin';
import { formMixin } from '@intake24/admin/components/entry';
import { jobParams, PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';
import { useEntry, useEntryFetch, useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';

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

  components: { ...jobParams, PollsJobList },

  mixins: [formMixin],

  setup(props) {
    const i18n = useI18n();

    const jobType = ref<LocaleJobType[]>([
      'LocaleFoodNutrientMapping',
      'PairwiseSearchCopyAssociations',
    ]);
    const jobTypeList = ref(
      jobType.value.map((value) => ({ value, text: i18n.t(`jobs.types.${value}._`) }))
    );

    const defaultJobsParams = computed<
      Pick<JobParams, 'LocaleFoodNutrientMapping' | 'PairwiseSearchCopyAssociations'>
    >(() => ({
      LocaleFoodNutrientMapping: { localeId: props.id },
      PairwiseSearchCopyAssociations: { sourceLocaleId: '', targetLocaleId: props.id },
    }));

    const disabledJobParams = {
      LocaleFoodNutrientMapping: { localeId: true },
      PairwiseSearchCopyAssociations: { targetLocaleId: true },
    };

    const { entry, entryLoaded, refs, refsLoaded } = useEntry<LocaleEntry, LocaleRefs>(props);
    useEntryFetch(props);
    const { clearError, form } = useForm<LocaleTasksForm>({
      data: { job: jobType.value[0], params: defaultJobsParams.value.LocaleFoodNutrientMapping },
      config: { resetOnSubmit: false },
    });
    const { jobs, jobInProgress, startPolling } = usePollsForJobs(jobType.value);

    return {
      defaultJobsParams,
      disabledJobParams,
      jobType,
      jobTypeList,
      entry,
      entryLoaded,
      refs,
      refsLoaded,
      clearError,
      form,
      jobs,
      jobInProgress,
      startPolling,
    };
  },

  async mounted() {
    await this.startPolling(true);
  },

  methods: {
    updateJob() {
      this.form.errors.clear();
      this.form.params = this.defaultJobsParams[this.form.job];
    },

    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(`admin/locales/${this.id}/tasks`);

      this.jobs.unshift(job);
      await this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
