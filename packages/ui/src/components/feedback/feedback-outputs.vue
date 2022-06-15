<template>
  <v-col cols="auto" class="d-flex flex-column">
    <div class="text-subtitle-1 font-weight-medium text-uppercase text-center mb-2">
      {{ $t('feedback.outputs.title') }}
    </div>
    <v-btn
      v-if="outputs.includes('print')"
      link
      class="mb-3"
      color="primary"
      outlined
      :title="$t('feedback.outputs.print')"
      @click="printFeedback"
    >
      <v-icon left>fas fa-print</v-icon>
      {{ $t('feedback.outputs.print') }}
    </v-btn>
    <v-dialog v-if="outputs.includes('email')" v-model="email.dialog" max-width="450px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          link
          class="mb-3"
          color="primary"
          outlined
          :title="$t('feedback.outputs.email._')"
        >
          <v-icon left>fas fa-envelope</v-icon>
          {{ $t('feedback.outputs.email._') }}
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ $t('feedback.outputs.email.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="emailFeedback" autocomplete="off">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="email.form.email"
                    :error-messages="email.errors.get('email')"
                    :label="$t('common.email')"
                    hide-details="auto"
                    name="email"
                    outlined
                    prepend-inner-icon="fas fa-envelope"
                    @input="email.errors.clear('email')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email.form.emailConfirm"
                    :error-messages="email.errors.get('emailConfirm')"
                    :label="$t('common.emailConfirm')"
                    hide-details="auto"
                    name="emailConfirm"
                    outlined
                    prepend-inner-icon="fas fa-envelope"
                    @input="email.errors.clear('emailConfirm')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-alert v-if="message" type="success" outlined>
                    {{ message }}
                  </v-alert>
                  <v-alert v-if="retry.retryIn" type="warning" outlined>
                    {{ retryMessage }}
                  </v-alert>
                  <v-btn
                    type="submit"
                    color="secondary"
                    x-large
                    block
                    :disabled="!!retry.retryIn || email.errors.any()"
                  >
                    <v-icon left>fas fa-paper-plane</v-icon>
                    {{ $t('feedback.outputs.email.send') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="font-weight-bold"
            color="blue darken-3"
            text
            @click.stop="email.dialog = false"
          >
            {{ $t('common.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="outputs.includes('download')" v-model="download.dialog" max-width="450px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          link
          class="mb-3"
          color="primary"
          outlined
          :title="$t('feedback.outputs.download._')"
        >
          <v-icon left>fas fa-download</v-icon>
          {{ $t('feedback.outputs.download._') }}
        </v-btn>
      </template>
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ $t('feedback.outputs.download.title') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pa-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1 font-weight-medium">
                  {{ $t('feedback.outputs.download.subtitle') }}
                </div>
              </v-col>
              <v-col cols="12">
                <v-alert v-if="message" type="success" outlined>
                  {{ message }}
                </v-alert>
                <v-alert v-if="retry.retryIn" type="warning" outlined>
                  {{ retryMessage }}
                </v-alert>
                <v-btn
                  color="secondary"
                  x-large
                  block
                  :disabled="!!retry.retryIn"
                  @click.stop="downloadFeedback"
                >
                  <v-icon left>fas fa-paper-plane</v-icon>
                  {{ $t('feedback.outputs.download.send') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="font-weight-bold"
            color="blue darken-3"
            text
            @click.stop="download.dialog = false"
          >
            {{ $t('common.action.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script lang="ts">
import axios, { AxiosError } from 'axios';
import { defineComponent, PropType } from '@vue/composition-api';
import { Errors } from '@intake24/common/util';
import { downloadFile } from '@intake24/ui/util';
import { useLoading } from '@intake24/ui/stores';
import type { FeedbackOutput } from '@intake24/common/feedback';

export default defineComponent({
  name: 'FeedbackOutputs',

  props: {
    outputs: {
      type: Array as PropType<FeedbackOutput[]>,
      default: () => [],
    },
    surveyId: {
      type: String,
      required: true,
    },
    submissions: {
      type: Array as PropType<string[]>,
    },
  },

  data() {
    return {
      download: {
        dialog: false,
      },
      email: {
        emailDialog: false,
        form: {
          email: '',
          emailConfirm: '',
        },
        errors: new Errors(),
      },
      message: null as string | null,
      retry: {
        interval: undefined as number | undefined,
        retryIn: 0,
      },
    };
  },

  computed: {
    retryMessage(): string {
      return this.$t('feedback.outputs.retry', { secs: this.retry.retryIn }).toString();
    },
  },

  beforeDestroy() {
    this.clearFeedbackInterval();
  },

  methods: {
    async downloadFeedback() {
      const loading = useLoading();
      loading.addItem('feedback-download');

      try {
        const { surveyId: survey, submissions } = this;

        const res = await this.$http.get(`user/feedback`, {
          params: { survey, submissions },
          responseType: 'arraybuffer',
          headers: { accept: 'application/pdf' },
        });
        downloadFile(res, `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`);

        this.message = this.$t('feedback.outputs.download.sent').toString();
      } catch (err) {
        this.message = null;

        if (axios.isAxiosError(err)) {
          const { response: { status, headers = {} } = {} } = err;

          if (status === 429)
            this.setFeedbackInterval(parseInt(headers['ratelimit-reset'] ?? 60, 10));
        }
      } finally {
        loading.removeItem('feedback-download');
      }
    },

    async emailFeedback() {
      const loading = useLoading();
      loading.addItem('feedback-email');

      try {
        const {
          email: { form },
          surveyId: survey,
          submissions,
        } = this;

        await this.$http.post(`user/feedback`, { ...form }, { params: { survey, submissions } });

        this.email.form = { email: '', emailConfirm: '' };
        this.message = this.$t('feedback.outputs.email.sent').toString();
      } catch (err) {
        this.message = null;

        if (axios.isAxiosError(err)) {
          const { response: { status, data = {}, headers = {} } = {} } = err as AxiosError<any>;

          if (status === 422 && 'errors' in data) this.email.errors.record(data.errors);

          if (status === 429)
            this.setFeedbackInterval(parseInt(headers['ratelimit-reset'] ?? 60, 10));
        }
      } finally {
        loading.removeItem('feedback-email');
      }
    },

    feedbackInterval() {
      this.retry.retryIn -= this.retry.retryIn < 5 ? this.retry.retryIn : 5;

      if (!this.retry.retryIn) this.clearFeedbackInterval();
    },

    setFeedbackInterval(retryIn = 60) {
      if (this.retry.interval) clearInterval(this.retry.interval);
      this.retry = { retryIn, interval: setInterval(this.feedbackInterval, 5000) };
    },

    clearFeedbackInterval() {
      if (this.retry.interval) clearInterval(this.retry.interval);

      this.retry = { retryIn: 0, interval: undefined };
    },

    printFeedback() {
      window.print();
    },
  },
});
</script>

<style lang="scss" scoped></style>
