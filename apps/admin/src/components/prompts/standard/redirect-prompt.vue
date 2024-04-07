<template>
  <v-tab-item key="options" value="options">
    <v-row>
      <v-col cols="12" md="6">
        <v-card-title>{{ $t('survey-schemes.prompts.redirect-prompt.url.title') }}</v-card-title>
        <v-card-subtitle>
          {{ $t('survey-schemes.prompts.redirect-prompt.url.subtitle') }}
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            class="mb-4"
            hide-details="auto"
            :hint="$t('survey-schemes.prompts.redirect-prompt.url.hint')"
            :label="$t('survey-schemes.prompts.redirect-prompt.url._')"
            name="url"
            outlined
            persistent-hint
            :value="url"
            @input="update('url', $event)"
          />
          <v-combobox
            class="mb-4"
            hide-details="auto"
            :hint="$t('survey-schemes.prompts.redirect-prompt.identifier.hint')"
            :items="identifiers"
            :label="$t('survey-schemes.prompts.redirect-prompt.identifier._')"
            outlined
            persistent-hint
            :value="identifier"
            @change="updateIdentifier"
          />
          <v-text-field
            class="mb-4"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.redirect-prompt.timer._')"
            name="timer"
            outlined
            :rules="timerRules"
            :value="timer"
            @input="updateTimerValue"
          />
          <v-select
            :items="targets"
            :label="$t('survey-schemes.prompts.redirect-prompt.target._')"
            outlined
            prepend-inner-icon="fa-solid fa-arrow-up-right-from-square"
            :value="target"
            @change="update('target', $event)"
          />
        </v-card-text>
      </v-col>
      <v-col cols="12" md="6">
        <v-card-title>
          <v-icon left>
            fas fa-star-half-stroke
          </v-icon>
          {{ $t('survey-schemes.prompts.final-prompt.rating.title') }}
        </v-card-title>
        <v-card-text>
          <v-switch
            hide-details="auto"
            :input-value="rating"
            :label="$t('survey-schemes.prompts.final-prompt.rating._')"
            @change="update('rating', $event)"
          />
        </v-card-text>
      </v-col>
    </v-row>
  </v-tab-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import type { RuleCallback } from '@intake24/admin/types';
import type { Prompts } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

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
    target: {
      type: String as PropType<Prompts['redirect-prompt']['target']>,
      required: true,
    },
    rating: {
      type: Boolean as PropType<Prompts['redirect-prompt']['rating']>,
      required: true,
    },
  },

  setup() {
    const { i18n } = useI18n();
    const identifiers = ['userId', 'username', 'urlAuthToken'].map(value => ({
      text: i18n.t(`survey-schemes.prompts.redirect-prompt.identifier.options.${value}`),
      value,
    }));
    const targets = ['_self', '_blank'].map(value => ({
      text: i18n.t(`survey-schemes.prompts.redirect-prompt.target.${value}`),
      value,
    }));

    return { identifiers, targets };
  },

  computed: {
    timerRules(): RuleCallback[] {
      return [
        (value: string | null): boolean | string =>
          Number.isInteger(value) || 'Timer value needs to be a number.',
      ];
    },
  },

  methods: {
    updateTimerValue(value: any) {
      const timerValue = Number.parseInt(value, 10);
      this.update('timer', Number.isNaN(timerValue) ? 0 : timerValue);
    },

    updateIdentifier(value: string | null | (typeof this.identifiers)[0]) {
      this.update('identifier', !value || typeof value === 'string' ? value : value.value);
    },
  },
});
</script>

<style lang="scss" scoped></style>
