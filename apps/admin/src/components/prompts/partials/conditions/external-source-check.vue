<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.provider"
        hide-details="auto"
        :items="sources"
        :label="$t('survey-schemes.prompts.externalSources.sources._')"
        variant="outlined"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-select
        v-model="currentValue.state"
        hide-details="auto"
        :items="states"
        :label="$t('survey-schemes.prompts.externalSources.states._')"
        variant="outlined"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { externalSources } from '@intake24/common/prompts';
import type { ExternalSourcePropertyCheck } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';
import { useCheck } from './use-check';

export default defineComponent({
  name: 'ExternalSourceCheck',

  props: {
    modelValue: {
      type: Object as PropType<ExternalSourcePropertyCheck>,
      required: true,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const { currentValue } = useCheck(props, { emit });

    const sources = externalSources.map(value => ({
      title: i18n.t(`survey-schemes.prompts.externalSources.sources.${value}`),
      value,
    }));
    const states = [true, false, 'selected', 'missing'].map(value => ({
      value,
      title: i18n.t(`survey-schemes.prompts.externalSources.states.${value}`),
    }));

    return { sources, states, currentValue };
  },
});
</script>

<style lang="scss" scoped></style>
