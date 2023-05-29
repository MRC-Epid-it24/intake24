<template>
  <div>
    <v-tab-item key="options">
      <v-card-title>{{ $t('survey-schemes.prompts.redirect-prompt.url.title') }}</v-card-title>
      <v-card-subtitle>
        {{ $t('survey-schemes.prompts.redirect-prompt.url.subtitle') }}
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details="auto"
              :hint="$t('survey-schemes.prompts.redirect-prompt.url.hint')"
              :label="$t('survey-schemes.prompts.redirect-prompt.url._')"
              name="url"
              outlined
              persistent-hint
              :value="url"
              @input="update('url', $event)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              hide-details="auto"
              :hint="$t('survey-schemes.prompts.redirect-prompt.identifier.hint')"
              :items="identifiers"
              :label="$t('survey-schemes.prompts.redirect-prompt.identifier._')"
              outlined
              persistent-hint
              :value="identifier"
              @change="updateIdentifier"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title>{{ $t('survey-schemes.prompts.redirect-prompt.timer.title') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              hide-details="auto"
              :label="$t('survey-schemes.prompts.redirect-prompt.timer._')"
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
import type { PropType } from 'vue';
import isInteger from 'lodash/isInteger';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { Prompts } from '@intake24/common/prompts';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'RedirectPrompt',

  mixins: [basePrompt],

  props: {
    url: {
      type: String as PropType<Prompts['redirect-prompt']['url']>,
      required: true,
    },
    identifier: {
      type: String as PropType<Prompts['redirect-prompt']['identifier']>,
      required: true,
    },
    timer: {
      type: Number as PropType<Prompts['redirect-prompt']['timer']>,
      required: true,
    },
  },

  data() {
    return {
      identifiers: ['userId', 'username', 'urlAuthToken'].map((value) => ({
        text: this.$t(`survey-schemes.prompts.redirect-prompt.identifier.options.${value}`),
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

    updateIdentifier(value: string | null | (typeof this.identifiers)[0]) {
      this.update('identifier', !value || typeof value === 'string' ? value : value.value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
