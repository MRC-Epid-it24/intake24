<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-btn large v-bind="attrs" v-on="on">
        <v-list-item-title>
          <v-icon left>fa-upload</v-icon>
          {{ label }}
        </v-list-item-title>
      </v-btn>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="primary" dark flat>
        <v-icon dark left>fa-upload</v-icon>
        <v-toolbar-title>
          {{ dialogTitle }}
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
                  :label="$t('common.csvUpload.file')"
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
                  {{ $t('common.action.upload') }}
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

type CsvUploadForm = {
  file: File | null;
};

export default defineComponent({
  name: 'CsvUpload',

  mixins: [respondentsJob],

  props: {
    label: {
      type: String,
      required: true,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      form: createForm<CsvUploadForm>({ file: null }, { multipart: true }),
    };
  },

  methods: {
    close() {
      this.form.reset();
      this.dialog = false;
    },

    async submit() {
      if (this.jobInProgress) return;

      const job = await this.form.post<JobEntry>(this.endpoint);

      this.jobs.unshift(job);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
