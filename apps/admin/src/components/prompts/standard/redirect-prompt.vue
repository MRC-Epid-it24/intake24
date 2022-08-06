<template>
  <div>
    <prompt-content
      v-bind="{ name, text, description }"
      @update:name="update('name', $event)"
      @update:text="update('text', $event)"
      @update:description="update('description', $event)"
    ></prompt-content>
    <prompt-conditions
      :conditions="conditions"
      @update:conditions="update('conditions', $event)"
    ></prompt-conditions>
    <v-tab-item key="options">
      <v-card-title>{{ $t('survey-schemes.redirect.url.title') }}</v-card-title>
      <v-card-subtitle>{{ $t('survey-schemes.redirect.url.subtitle') }}</v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              :value="url"
              :label="$t('survey-schemes.redirect.url._')"
              :hint="$t('survey-schemes.redirect.url.hint')"
              persistent-hint
              hide-details="auto"
              name="url"
              outlined
              @input="update('url', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              :value="identifier"
              :items="identifiers"
              :label="$t('survey-schemes.redirect.identifier._')"
              hide-details="auto"
              outlined
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
              :value="timer"
              :label="$t('survey-schemes.redirect.timer._')"
              :rules="timerRules"
              hide-details="auto"
              name="timer"
              outlined
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

import basePrompt from '../partials/base-prompt';

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

  computed: {
    timerRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          isInteger(value) || 'Timer value needs to be a number.',
      ];
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

  methods: {
    updateTimerValue(value: any) {
      const timerValue = parseInt(value, 10);
      this.update('timer', Number.isNaN(timerValue) ? 0 : timerValue);
    },
  },
});
</script>

<style lang="scss" scoped></style>
