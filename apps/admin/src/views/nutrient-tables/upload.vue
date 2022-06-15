<template>
  <layout v-bind="{ id, entry }">
    <v-container fluid>
      <v-form @keydown.native="clearError" @submit.prevent="submit">
        <v-card-title>{{ $t('nutrient-tables.upload.title') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="form.type"
                    :items="jobTypeList"
                    :label="$t('nutrient-tables.upload.type')"
                    hide-details="auto"
                    name="type"
                    outlined
                    prepend-icon="fa-running"
                    @change="form.errors.clear('type')"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-file-input
                    v-model="form.file"
                    :error-messages="form.errors.get('file')"
                    :label="$t('nutrient-tables.upload.file')"
                    hide-details="auto"
                    name="file"
                    outlined
                    prepend-icon="fa-file-csv"
                    @change="form.errors.clear('file')"
                  ></v-file-input>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" sm="10" md="8" lg="6">
                  <v-btn
                    :disabled="form.errors.any() || jobInProgress || isAppLoading"
                    block
                    x-large
                    type="submit"
                    color="secondary"
                    :title="$t('common.action.upload')"
                  >
                    <v-icon left>fa-upload</v-icon> {{ $t('common.action.upload') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }" @download="download"></polls-job-list>
        </v-card-text>
      </v-form>
    </v-container>
  </layout>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import type {
  JobEntry,
  NutrientTableEntry,
  NutrientTableRefs,
} from '@intake24/common/types/http/admin';
import type { JobType } from '@intake24/common/types';
import type { DetailMixin } from '@intake24/admin/types';
import detailMixin from '@intake24/admin/components/entry/detail-mixin';
import { PollsForJobs } from '@intake24/admin/components/polls-for-jobs';
import { form } from '@intake24/admin/helpers';

type Mixins = InstanceType<typeof PollsForJobs>;

type UploadForm = {
  file: File | null;
  type: string;
};

export default (
  Vue as VueConstructor<Vue & DetailMixin<NutrientTableEntry, NutrientTableRefs> & Mixins>
).extend({
  name: 'NutrientTableUpload',

  mixins: [detailMixin, PollsForJobs],

  data() {
    const jobType: JobType[] = ['NutrientTableImportMapping', 'NutrientTableImportData'];

    const jobTypeList = jobType.map((item) => ({
      value: item,
      text: this.$t(`jobs.types.${item}`),
    }));

    return {
      form: form<UploadForm>(
        {
          file: null,
          type: jobTypeList[0].value,
        },
        { multipart: true }
      ),
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

      const job = await this.form.post<JobEntry>(`admin/nutrient-tables/${this.id}/upload`);

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
