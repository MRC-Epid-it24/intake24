<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-list-item key="respondentsUpload" v-bind="attrs" link v-on="on">
        <v-list-item-title>
          <v-icon left>fa-upload</v-icon>
          {{ $t('surveys.respondents.upload._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="primary" dark flat>
        <v-icon dark left>fa-upload</v-icon>
        <v-toolbar-title>
          {{ $t(`surveys.respondents.upload.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm>
                <v-file-input
                  v-model="form.file"
                  :error-messages="form.errors.get('file')"
                  hide-details="auto"
                  :label="$t('surveys.respondents.upload.file')"
                  name="file"
                  outlined
                  prepend-icon=""
                  prepend-inner-icon="fa-file-csv"
                  @change="form.errors.clear('file')"
                ></v-file-input>
              </v-col>
              <v-col cols="12" sm="auto">
                <v-btn block color="secondary" :disabled="jobInProgress" type="submit" x-large>
                  <v-icon left>fa-upload</v-icon>
                  {{ $t('surveys.respondents.upload.submit') }}
                </v-btn>
              </v-col>
            </v-row>
            <polls-job-list v-bind="{ jobs }"></polls-job-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="font-weight-bold" color="info" text @click.stop="close">
            {{ $t('common.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { JobEntry } from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';

import respondentsJob from './respondents-job';

type RespondentsUploadForm = {
  file: File | null;
};

export default defineComponent({
  name: 'RespondentsUpload',

  mixins: [respondentsJob],

  data() {
    return {
      form: createForm<RespondentsUploadForm>({ file: null }, { multipart: true }),
      jobType: 'SurveyRespondentsImport',
    };
  },

  methods: {
    close() {
      this.form.reset();
      this.dialog = false;
    },

    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(
        `admin/surveys/${this.surveyId}/respondents/upload`
      );

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
