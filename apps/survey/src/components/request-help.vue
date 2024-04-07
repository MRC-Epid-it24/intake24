<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.smAndDown"
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
          <v-icon left>
            $info
          </v-icon>{{ $t('common.help._') }}
        </v-btn>
      </slot>
    </template>
    <v-card :tile="isMobile">
      <v-toolbar color="secondary" dark>
        <v-btn dark icon :title="$t('common.action.cancel')" @click.stop="cancel">
          <v-icon>$cancel</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('common.help.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-form @keydown.native="errors.clear()" @submit.prevent="requestHelp">
        <v-card-text>
          <p class="mx-2">
            {{ $t('common.help.text') }}
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
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  :error-messages="errors.get('email')"
                  hide-details="auto"
                  :label="$t('common.email')"
                  name="email"
                  outlined
                  prepend-inner-icon="fas fa-envelope"
                />
              </v-col>
              <v-col cols="4">
                <v-autocomplete
                  v-model="form.phoneCountry"
                  hide-details="auto"
                  :items="regionCodes"
                  name="phoneCountry"
                  outlined
                  single-line
                >
                  <template #item="{ item }">
                    <span :class="`fi fi-${item.value.toLowerCase()} mr-3`" />
                    {{ item.text }}
                  </template>
                  <template #selection="{ item }">
                    <span :class="`fi fi-${item.value.toLowerCase()} mr-3`" />
                    {{ item.countryCode }}
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols>
                <v-text-field
                  v-model="form.phone"
                  :error-messages="errors.get('phone')"
                  hide-details="auto"
                  :label="$t('common.phone')"
                  name="phone"
                  outlined
                  prepend-inner-icon="fas fa-phone"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.message"
                  :counter="500"
                  :error-messages="errors.get('message')"
                  hide-details="auto"
                  :label="$t('common.message')"
                  name="message"
                  outlined
                  prepend-inner-icon="fas fa-message"
                />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col :cols="isMobile ? '12' : 'auto'">
                <v-btn
                  :block="isMobile"
                  color="primary"
                  :disabled="errors.any()"
                  outlined
                  rounded
                  :title="$t('common.help.title')"
                  type="submit"
                  x-large
                >
                  <v-icon left>
                    fas fa-circle-question
                  </v-icon>
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
import { getCountryCodeForRegionCode, getSupportedRegionCodes } from 'awesome-phonenumber';
import axios, { HttpStatusCode } from 'axios';
import { defineComponent, ref } from 'vue';

import type { SurveyHelpRequest } from '@intake24/common/types/http';
import { Errors } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

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

  emits: ['cancel'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const regionCodes = getSupportedRegionCodes().map((code) => {
      const countryCode = `+${getCountryCodeForRegionCode(code)}`;

      return {
        text: `${i18n.t(`flags.${code.toLowerCase()}`)} (${countryCode})`,
        value: code,
        countryCode,
      };
    });

    const dialog = ref(false);
    const errors = ref(new Errors());

    const createForm = (): SurveyHelpRequest => ({
      name: '',
      email: '',
      phone: '',
      phoneCountry: window.navigator.language.split('-')[1] ?? 'GB',
      message: '',
    });

    const form = ref(createForm());

    const reset = () => {
      form.value = createForm();
    };

    const close = () => {
      dialog.value = false;
    };

    const cancel = () => {
      close();
      emit('cancel');
    };

    const requestHelp = async () => {
      const { surveyId } = props;

      try {
        await surveyService.requestHelp(surveyId, form.value);
        useMessages().success(i18n.t('common.help.sent').toString());
        reset();
        close();
      }
      catch (err) {
        if (
          axios.isAxiosError(err)
          && err.response?.status === HttpStatusCode.BadRequest
          && 'errors' in err.response.data
        ) {
          errors.value.record(err.response.data.errors);
          return;
        }

        throw err;
      }
    };

    return {
      dialog,
      createForm,
      form,
      errors,
      cancel,
      requestHelp,
      getCountryCodeForRegionCode,
      regionCodes,
    };
  },
});
</script>
