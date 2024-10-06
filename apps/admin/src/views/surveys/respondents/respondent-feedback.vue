<template>
  <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="600px">
    <template #activator="{ props }">
      <v-list-item key="respondentsFeedback" link v-bind="props">
        <v-list-item-title>
          <v-icon icon="fas fa-comments" start />
          {{ $t('surveys.respondents.feedback._') }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <v-card :tile="$vuetify.display.smAndDown">
      <v-toolbar color="secondary" dark flat>
        <v-btn icon="$cancel" :title="$t('common.action.cancel')" variant="plain" @click.stop="close" />
        <v-toolbar-title>
          {{ $t(`surveys.respondents.feedback.title`) }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        {{ $t(`surveys.respondents.feedback.details`) }}
      </v-card-title>
      <v-table class="mx-4">
        <tbody>
          <tr>
            <th>{{ $t(`users.username`) }}</th>
            <th>{{ user.username }}</th>
          </tr>
        </tbody>
      </v-table>
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn block :href="user.feedbackAuthUrl" size="x-large" target="_blank" variant="outlined">
                <v-icon icon="fas fa-up-right-from-square" start />
                {{ $t(`surveys.respondents.feedback.open`) }}
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn block size="x-large" variant="outlined" @click.stop="download">
                <v-icon icon="$download" start />
                {{ $t(`surveys.respondents.feedback.download`) }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-divider />
      <v-form @submit.prevent="email">
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
                  prepend-inner-icon="fas fa-envelope"
                  variant="outlined"
                  @update:model-value="form.errors.clear('email')"
                />
              </v-col>
              <v-col cols="12" sm="auto">
                <v-radio-group
                  v-model="form.copy"
                  :error-messages="form.errors.get('copy')"
                  inline
                  :label="$t('surveys.respondents.feedback.email.copy._')"
                  mandatory
                  name="copy"
                  @update:model-value="form.errors.clear('copy')"
                >
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.none')" value="none" />
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.cc')" value="cc" />
                  <v-radio :label="$t('surveys.respondents.feedback.email.copy.bcc')" value="bcc" />
                </v-radio-group>
              </v-col>
              <v-col class="ml-auto" cols="12" sm="auto">
                <v-btn block color="primary" :disabled="form.errors.any()" size="x-large" type="submit">
                  <v-icon icon="fas fa-envelope" start />
                  {{ $t('surveys.respondents.feedback.email.sent') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="font-weight-bold" color="info" variant="text" @click.stop="close">
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

import type { RespondentEntry } from '@intake24/common/types/http/admin';
import { createForm } from '@intake24/admin/util';
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
      type: Object as PropType<RespondentEntry>,
      required: true,
    },
  },

  data() {
    return {
      apiUrl: `admin/surveys/${this.surveyId}/respondents/${this.user.username}/feedback`,
      dialog: false,
      form: createForm<RespondentFeedback>({ email: null, copy: 'none' }),
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
            .substring(0, 10)}.pdf`,
        );
      }
      finally {
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
