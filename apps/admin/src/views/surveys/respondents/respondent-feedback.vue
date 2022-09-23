<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-list-item key="respondentsUpload" v-bind="attrs" link v-on="on">
        <v-list-item-title>
          <v-icon left>fas fa-comments</v-icon>
          {{ $t('surveys.respondents.feedback._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-icon dark left>fas fa-comments</v-icon>
        <v-toolbar-title>
          {{ $t(`surveys.respondents.feedback.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        {{ $t(`surveys.respondents.feedback.details`) }}
      </v-card-title>
      <v-simple-table class="mx-4">
        <tbody>
          <tr>
            <th>{{ $t(`users.username`) }}</th>
            <th>{{ user.username }}</th>
          </tr>
        </tbody>
      </v-simple-table>
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn block :href="user.feedbackAuthUrl" outlined target="_blank" x-large>
                <v-icon left>fas fa-up-right-from-square</v-icon>
                {{ $t(`surveys.respondents.feedback.open`) }}
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block outlined x-large @click.stop="download">
                <v-icon left>fas fa-download</v-icon>
                {{ $t(`surveys.respondents.feedback.download`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider></v-divider>
      <v-form ref="form" @submit.prevent="email">
        <v-card-title>
          {{ $t(`surveys.respondents.feedback.email.title`) }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  :error-messages="form.errors.get('email')"
                  hide-details="auto"
                  :label="$t('common.email')"
                  name="email"
                  outlined
                  prepend-inner-icon="fas fa-envelope"
                  @input="form.errors.clear('email')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="auto">
                <v-radio-group
                  v-model="form.copy"
                  :error-messages="form.errors.get('copy')"
                  :label="$t('surveys.respondents.feedback.email.copy._')"
                  mandatory
                  name="copy"
                  row
                  @change="form.errors.clear('copy')"
                >
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.none')" value="none">
                  </v-radio>
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.cc')" value="cc">
                  </v-radio>
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.bcc')" value="bcc">
                  </v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="ml-auto" cols="12" sm="auto">
                <v-btn block color="secondary" :disabled="form.errors.any()" type="submit" x-large>
                  <v-icon left>fas fa-envelope</v-icon>
                  {{ $t('surveys.respondents.feedback.email.sent') }}
                </v-btn>
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
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { SurveyRespondentEntry } from '@intake24/common/types/http/admin';
import { form } from '@intake24/admin/helpers';
import { useLoading } from '@intake24/ui/stores';
import { downloadFile } from '@intake24/ui/util';

type RespondentFeedback = {
  email: string | null;
  copy: 'cc' | 'bcc' | 'none';
};

export default defineComponent({
  name: 'RespondentFeedback',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    user: {
      type: Object as PropType<SurveyRespondentEntry>,
      required: true,
    },
  },

  data() {
    return {
      apiUrl: `admin/surveys/${this.surveyId}/respondents/${this.user.userId}/feedback`,
      dialog: false,
      form: form<RespondentFeedback>({ email: null, copy: 'none' }),
    };
  },

  methods: {
    close() {
      this.form.reset();
      this.dialog = false;
    },

    async download() {
      const loading = useLoading();
      loading.addItem('respondent-feedback-download');

      try {
        const res = await this.$http.get(this.apiUrl, {
          responseType: 'arraybuffer',
          headers: { accept: 'application/pdf' },
        });
        downloadFile(
          res,
          `Intake24-${this.surveyId}-${this.user.username}-${new Date()
            .toISOString()
            .substring(0, 10)}.pdf`
        );
      } finally {
        loading.removeItem('respondent-feedback-download');
      }
    },

    async email() {
      await this.form.post(this.apiUrl);
    },
  },
});
</script>

<style lang="scss" scoped></style>
