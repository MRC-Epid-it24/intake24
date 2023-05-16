<template>
  <layout v-bind="{ id, entry }">
    <v-container fluid>
      <v-form @submit.prevent="submit">
        <v-card-title>{{ $t('nutrient-tables.upload.title') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="form.type"
                    hide-details="auto"
                    :items="jobTypeList"
                    :label="$t('nutrient-tables.upload.type')"
                    name="type"
                    outlined
                    prepend-inner-icon="fa-running"
                    @change="form.errors.clear('type')"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="form.file"
                    :error-messages="form.errors.get('file')"
                    hide-details="auto"
                    :label="$t('nutrient-tables.upload.file')"
                    name="file"
                    outlined
                    prepend-icon=""
                    prepend-inner-icon="fa-file-csv"
                    @change="form.errors.clear('file')"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" lg="6" md="8" sm="10">
                  <v-btn
                    block
                    color="secondary"
                    :disabled="form.errors.any() || jobInProgress || isAppLoading"
                    :title="$t('common.action.upload')"
                    type="submit"
                    x-large
                  >
                    <v-icon left>fa-upload</v-icon> {{ $t('common.action.upload') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }"></polls-job-list>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobType } from '@intake24/common/types';
import type { JobEntry, NutrientTableEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';
import { useEntry, useEntryFetch, useForm } from '@intake24/admin/composables';
import { useI18n } from '@intake24/admin/i18n';

type UploadForm = {
  file: File | null;
  type: string;
};

export default defineComponent({
  name: 'NutrientTableUpload',

  components: { PollsJobList },

  mixins: [detailMixin],

  setup(props) {
    const i18n = useI18n();

    const jobType: JobType[] = ['NutrientTableIMappingImport', 'NutrientTableDataImport'];
    const jobTypeList = jobType.map((value) => ({ value, text: i18n.t(`jobs.types.${value}._`) }));

    const { entry, entryLoaded } = useEntry<NutrientTableEntry>(props);
    useEntryFetch(props);
    const { clearError, form } = useForm<UploadForm>({
      data: { file: null, type: jobTypeList[0].value },
      config: { multipart: true },
    });
    const { jobs, jobInProgress, startPolling } = usePollsForJobs(jobType);

    return {
      jobTypeList,
      entry,
      entryLoaded,
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
    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(`admin/nutrient-tables/${this.id}/upload`);

      this.jobs.unshift(job);
      await this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
