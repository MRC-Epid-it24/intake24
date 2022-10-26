<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <v-container fluid>
      <v-form @submit.prevent="submit">
        <v-card-title>{{ $t('surveys.data-export.title') }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="12" md="6">
                  <date-picker
                    v-model="form.startDate"
                    clearable
                    :error-messages="form.errors.get('startDate')"
                    :label="$t('surveys.startDate').toString()"
                    @change="form.errors.clear('startDate')"
                  ></date-picker>
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker
                    v-model="form.endDate"
                    clearable
                    :error-messages="form.errors.get('endDate')"
                    :label="$t('surveys.endDate').toString()"
                    @change="form.errors.clear('endDate')"
                  ></date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    color="secondary"
                    :disabled="form.errors.any() || isAppLoading"
                    :title="$t('common.action.export')"
                    type="submit"
                    x-large
                  >
                    <v-icon left>fa-download</v-icon> {{ $t('common.action.export') }}
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

import type { JobEntry, SurveyEntry } from '@intake24/common/types/http/admin';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';
import { DatePicker } from '@intake24/admin/components/forms';
import { PollsForJobs } from '@intake24/admin/components/jobs';
import { form } from '@intake24/admin/helpers';

type SurveyDataExportForm = {
  startDate: string | null;
  endDate: string | null;
};

export default defineComponent({
  name: 'SurveyDataExport',

  components: { DatePicker },

  mixins: [detailMixin, PollsForJobs],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<SurveyEntry>(props.id);

    return { entry, entryLoaded };
  },

  data() {
    return {
      menus: { startDate: false, endDate: false },
      form: form<SurveyDataExportForm>(
        {
          startDate: null,
          endDate: null,
        },
        { resetOnSubmit: false }
      ),
      jobType: 'SurveyDataExport',
    };
  },

  watch: {
    entry(val) {
      if (Object.keys(val).length) this.form.load(val);
    },
  },

  async mounted() {
    await this.startPolling(true);
  },

  methods: {
    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(`admin/surveys/${this.id}/data-export`);

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
