<template>
  <div>
    <v-tab-item key="options">
      <v-card-title>{{ $t('survey-schemes.redirect.url.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('survey-schemes.redirect.url.subtitle') }}</v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details="auto"
              :hint="$t('survey-schemes.redirect.url.hint')"
              :label="$t('survey-schemes.redirect.url._')"
              name="url"
              outlined
              persistent-hint
              :value="url"
              @input="update('url', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              hide-details="auto"
              :items="identifiers"
              :label="$t('survey-schemes.redirect.identifier._')"
              outlined
              :value="identifier"
              @change="update('identifier', $event)"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>{{ $t('survey-schemes.redirect.timer.title') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details="auto"
              :label="$t('survey-schemes.redirect.timer._')"
              name="timer"
              outlined
              :rules="timerRules"
              :value="timer"
              @input="updateTimerValue"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-tab-item>
  </div>
</template>

<script lang="ts">
import isInteger from 'lodash/isInteger';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'RedirectPrompt',

  mixins: [basePrompt],

  props: {
    url: {
      type: String,
      default: null,
    },
    identifier: {
      type: String,
      default: 'username',
    },
    timer: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      identifiers: ['userId', 'username', 'token', 'custom'].map((value) => ({
        text: this.$t(`survey-schemes.redirect.identifier.options.${value}`),
        value,
      })),
    };
  },

  computed: {
    timerRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          isInteger(value) || 'Timer value needs to be a number.',
      ];
    },
  },

  methods: {
    updateTimerValue(value: any) {
      const timerValue = parseInt(value, 10);
      this.update('timer', Number.isNaN(timerValue) ? 0 : timerValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
