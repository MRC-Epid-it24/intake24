<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.breakpoint.smAndDown" max-width="600px">
    <template #activator="{ attrs, on }">
      <v-list-item key="authUrls" v-bind="attrs" link v-on="on">
        <v-list-item-title>
          <v-icon left>$download</v-icon>
          {{ $t('surveys.respondents.authUrls._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card :tile="$vuetify.breakpoint.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-icon dark left>$download</v-icon>
        <v-toolbar-title>
          {{ $t(`surveys.respondents.authUrls.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="6" sm="8">
              <v-btn block color="primary" :disabled="jobInProgress" x-large @click="submit">
                <v-icon left>$download</v-icon>
                {{ $t('surveys.respondents.authUrls.submit') }}
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
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { PollsJobList, usePollsForJobs } from '@intake24/admin/components/jobs';

export default defineComponent({
  name: 'RespondentsAuthUrlExport',

  components: { PollsJobList },

  props: {
    surveyId: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const jobType = 'SurveyAuthUrlsExport';
    const jobQuery = computed(() => ({ surveyId: props.surveyId }));

    const { dialog, jobs, jobInProgress, startPolling } = usePollsForJobs(jobType, jobQuery);

    return { dialog, jobs, jobInProgress, startPolling };
  },

  methods: {
    close() {
      this.dialog = false;
    },

    async submit() {
      if (this.jobInProgress) return;

      const { data } = await this.$http.post(
        `admin/surveys/${this.surveyId}/respondents/export-auth-urls`
      );

      this.jobs.unshift(data);
      await this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
