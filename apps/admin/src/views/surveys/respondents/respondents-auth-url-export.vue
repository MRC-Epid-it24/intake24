<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item key="authUrls" v-bind="attrs" v-on="on" link>
        <v-list-item-title>
          <v-icon left>fa-download</v-icon>
          {{ $t('surveys.respondents.authUrls._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-icon dark left>fa-download</v-icon>
        <v-toolbar-title>
          {{ $t(`surveys.respondents.authUrls.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-btn color="secondary" x-large block @click="submit" :disabled="jobInProgress">
                <v-icon left>fa-download</v-icon>
                {{ $t('surveys.respondents.authUrls.submit') }}
              </v-btn>
            </v-col>
          </v-row>
          <polls-job-list v-bind="{ jobs }" @download="download"></polls-job-list>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="font-weight-bold" color="blue darken-3" text @click.stop="close">
          {{ $t('common.action.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import respondentsJob from './respondents-job';

export default defineComponent({
  name: 'RespondentsAuthUrlExport',

  mixins: [respondentsJob],

  data() {
    return {
      jobType: 'SurveyExportRespondentAuthUrls',
    };
  },

  methods: {
    async submit() {
      if (this.jobInProgress) return;

      const { data } = await this.$http.post(
        `admin/surveys/${this.surveyId}/respondents/export-auth-urls`
      );

      this.jobs.unshift(data);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
