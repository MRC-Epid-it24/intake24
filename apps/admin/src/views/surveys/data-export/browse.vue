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
import { defineComponent, onMounted, watch } from 'vue';

import type { JobEntry, SurveyEntry } from '@intake24/common/types/http/admin';
import { detailMixin } from '@intake24/admin/components/entry';
import { DatePicker } from '@intake24/admin/components/forms';
import { PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';
import { useEntry, useEntryFetch, useForm } from '@intake24/admin/composables';

type SurveyDataExportForm = {
  startDate: string | null;
  endDate: string | null;
};

export default defineComponent({
  name: 'SurveyDataExport',

  components: { DatePicker, PollsJobList },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useEntry<SurveyEntry>(props);
    useEntryFetch(props);
    const { jobs, jobInProgress, startPolling } = usePollsForJobs('SurveyDataExport');

    const { form } = useForm<SurveyDataExportForm>({
      data: { startDate: null, endDate: null },
      config: { resetOnSubmit: false },
    });

    const submit = async () => {
      if (jobInProgress.value) return;

      const job = await form.post<JobEntry>(`admin/surveys/${props.id}/data-export`);

      jobs.value.unshift(job);
      await startPolling();
    };

    watch(entry, (val) => {
      if (!Object.keys(val).length) return;

      const { startDate, endDate } = val;

      form.load({ startDate, endDate });
    });

    onMounted(async () => {
      await startPolling(true);
    });

    return { entry, entryLoaded, form, jobs, jobInProgress, startPolling, submit };
  },
});
</script>

<style lang="scss" scoped></style>
