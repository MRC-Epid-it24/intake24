<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item key="authUrls" v-bind="attrs" v-on="on" link>
        <v-list-item-title>
          <v-icon class="mr-2">fa-download</v-icon>
          {{ $t('surveys.respondents.authUrls._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ $t(`surveys.respondents.authUrls.title`) }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
              <v-btn color="secondary" x-large block @click="submit" :disabled="jobInProgress">
                <v-icon class="mr-2">fa-download</v-icon>
                {{ $t('surveys.respondents.authUrls.submit') }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-list three-line>
                <v-list-item v-for="item in visibleJobs" :key="item.id">
                  <v-list-item-avatar>
                    <v-icon class="grey" dark>fa-running</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.type }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Started: {{ new Date(item.startedAt).toLocaleString() }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Completed:
                      {{ item.completedAt ? new Date(item.completedAt).toLocaleString() : '' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="item.downloadUrl"
                      :title="$t('common.action.download')"
                      icon
                      link
                      @click="download(item)"
                    >
                      <v-icon color="primary">fa-download</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-progress-circular
                      indeterminate
                      color="secondary"
                      v-if="item.progress != 1"
                    ></v-progress-circular>
                    <template v-else>
                      <v-icon v-if="item.successful" color="success" large>fa-check-circle</v-icon>
                      <v-icon v-if="!item.successful" color="error" large>fa-times-circle</v-icon>
                    </template>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
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
import Vue, { VueConstructor } from 'vue';
import RespondentsJobMixin from './RespondentsJobMixin';

type mixins = InstanceType<typeof RespondentsJobMixin>;

export default (Vue as VueConstructor<Vue & mixins>).extend({
  name: 'RespondentsAuthUrlExport',

  mixins: [RespondentsJobMixin],

  data() {
    return {
      jobType: 'SurveyExportRespondentAuthUrls',
    };
  },

  beforeDestroy() {
    this.stopPolling();
  },

  methods: {
    async submit() {
      if (this.jobInProgress) return;

      const {
        data: { data },
      } = await this.$http.post(`admin/surveys/${this.surveyId}/respondents/export-auth-urls`);

      this.jobs.unshift(data);
      this.startPolling();
    },
  },
});
</script>

<style lang="scss" scoped></style>
