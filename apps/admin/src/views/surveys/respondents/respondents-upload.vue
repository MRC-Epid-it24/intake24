<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-list-item key="respondentsUpload" v-bind="attrs" link v-on="on">
        <v-list-item-title>
          <v-icon left>
            $upload
          </v-icon>
          {{ $t('surveys.respondents.upload._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-icon dark left>
          $upload
        </v-icon>
        <v-toolbar-title>
          {{ $t(`surveys.respondents.upload.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form @submit.prevent="submit">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm>
                <v-file-input
                  v-model="form.file"
                  :error-messages="form.errors.get('file')"
                  hide-details="auto"
                  :label="$t('common.file.csv')"
                  name="file"
                  outlined
                  prepend-icon=""
                  prepend-inner-icon="fas fa-file-csv"
                  @change="form.errors.clear('file')"
                />
              </v-col>
              <v-col cols="12" sm="auto">
                <v-btn block color="primary" :disabled="jobInProgress" type="submit" x-large>
                  <v-icon left>
                    $upload
                  </v-icon>
                  {{ $t('surveys.respondents.upload.submit') }}
                </v-btn>
              </v-col>
            </v-row>
            <polls-job-list v-bind="{ jobs }" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="font-weight-bold" color="info" text @click.stop="close">
            {{ $t('common.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';

import type { JobAttributes } from '@intake24/common/types/http/admin';
import { PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';
import { createForm } from '@intake24/admin/util';

type RespondentsUploadForm = {
  file: File | null;
};

export default defineComponent({
  name: 'RespondentsUpload',

  components: { PollsJobList },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const jobType = 'SurveyRespondentsImport';
    const jobQuery = computed(() => ({ surveyId: props.surveyId }));

    const form = reactive(createForm<RespondentsUploadForm>({ file: null }, { multipart: true }));

    const { dialog, jobs, jobInProgress, startPolling } = usePollsForJobs(jobType, jobQuery);

    return { form, dialog, jobs, jobInProgress, startPolling };
  },

  methods: {
    close() {
      this.form.reset();
      this.dialog = false;
    },

    async submit() {
      if (this.jobInProgress)
        return;

      const job = await this.form.post<JobAttributes>(
        `admin/surveys/${this.surveyId}/respondents/upload`,
      );

      this.jobs.unshift(job);
      await this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
