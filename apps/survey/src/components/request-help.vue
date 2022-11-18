<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="isMobile"
    max-width="500px"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          color="grey"
          dark
          :disabled="disabled"
          :title="$t('common.help.title')"
          v-on="on"
        >
          <v-icon left>fas fa-circle-info</v-icon>{{ $t('common.help._') }}
        </v-btn>
      </slot>
    </template>
    <v-card :tile="isMobile">
      <v-toolbar color="primary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('common.help.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-subtitle class="mt-4">
        Please make sure that you've watched the Intake24 walkthrough video: Watch the tutorial
      </v-card-subtitle>
      <v-form @keydown.native="errors.clear($event.target.name)" @submit.prevent="requestHelp">
        <v-card-text>
          <p class="mx-2">
            If you would like someone from our team to help, please enter your name and the phone
            number that we can use to reach you.
          </p>
          <p class="mx-2">
            One of our support staff will call you on that number as soon as they can.
          </p>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :error-messages="errors.get('name')"
                  hide-details="auto"
                  :label="$t('common.name')"
                  name="name"
                  outlined
                  prepend-inner-icon="fas fa-user"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.phone"
                  :error-messages="errors.get('phone')"
                  hide-details="auto"
                  :label="$t('common.phone')"
                  name="phone"
                  outlined
                  prepend-inner-icon="fas fa-phone"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col :cols="isMobile ? '12' : 'auto'">
                <v-btn
                  :block="isMobile"
                  color="secondary"
                  :disabled="errors.any()"
                  outlined
                  rounded
                  :title="$t('common.help.title')"
                  type="submit"
                  x-large
                >
                  <v-icon left>fas fa-circle-question</v-icon>
                  {{ $t('common.help.title') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import type { AxiosError } from 'axios';
import axios from 'axios';
import { defineComponent } from 'vue';

import type { SurveyRequestHelpInput } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';

import { surveyService } from '../services';
import { useMessages } from '../stores';

export default defineComponent({
  name: 'RequestHelp',

  props: {
    surveyId: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const createForm = (): SurveyRequestHelpInput => ({ name: '', phone: '' });

    return {
      dialog: false,
      createForm,
      form: createForm(),
      errors: new Errors(),
    };
  },

  methods: {
    reset() {
      this.form = this.createForm();
    },

    close() {
      this.dialog = false;
    },

    cancel() {
      this.close();
      this.$emit('cancel');
    },

    async requestHelp() {
      const { form, surveyId } = this;

      try {
        await surveyService.requestHelp(surveyId, form);
        useMessages().success(this.$t('common.help.sent').toString());
        this.reset();
        this.close();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const { response: { status, data = {} } = {} } = err as AxiosError<any>;

          if (status === 422 && 'errors' in data) {
            this.errors.record(data.errors);
            return;
          }
        }

        throw err;
      }
    },
  },
});
</script>
