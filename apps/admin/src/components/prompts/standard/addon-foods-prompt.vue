<template>
  <v-tabs-window-item key="options" value="options">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-card-title>{{ $t('survey-schemes.prompts.addon-foods-prompt.trigger._') }}</v-card-title>
          <v-select
            class="mb-4"
            hide-details="auto"
            :items="triggers"
            :label="$t('survey-schemes.prompts.addon-foods-prompt.trigger.type')"
            :model-value="trigger.type"
            variant="outlined"
            @update:model-value="update('trigger', { ...trigger, type: $event })"
          />
          <v-text-field
            :disabled="['afp', 'any'].includes(trigger.type)"
            hide-details="auto"
            :label="$t('survey-schemes.prompts.addon-foods-prompt.trigger.value')"
            :model-value="trigger.value"
            variant="outlined"
            @update:model-value="update('trigger', { ...trigger, value: $event })"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title>{{ $t('survey-schemes.prompts.addon-foods-prompt.lookup._') }}</v-card-title>
          <v-select
            class="mb-4"
            hide-details="auto"
            :items="['category', 'food']"
            :label="$t('survey-schemes.prompts.addon-foods-prompt.lookup.type')"
            :model-value="lookup.type"
            variant="outlined"
            @update:model-value="update('lookup', { ...lookup, type: $event })"
          />
          <v-text-field
            hide-details="auto"
            :label="$t('survey-schemes.prompts.addon-foods-prompt.lookup.value')"
            :model-value="lookup.value"
            variant="outlined"
            @update:model-value="update('lookup', { ...lookup, value: $event })"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-switch
            hide-details="auto"
            :label="$t('survey-schemes.prompts.addon-foods-prompt.multiple')"
            :model-value="multiple"
            @update:model-value="update('multiple', $event)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-tabs-window-item>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

import { addonFoodTriggers, type Prompts } from '@intake24/common/prompts';
import { useI18n } from '@intake24/i18n';

import { basePrompt } from '../partials';

export default defineComponent({
  name: 'AddonFoodsPrompt',

  mixins: [basePrompt],

  props: {
    lookup: {
      type: Object as PropType<Prompts['addon-foods-prompt']['lookup']>,
      required: true,
    },
    multiple: {
      type: Boolean as PropType<Prompts['addon-foods-prompt']['multiple']>,
      required: true,
    },
    trigger: {
      type: Object as PropType<Prompts['addon-foods-prompt']['trigger']>,
      required: true,
    },
  },

  setup() {
    const { i18n } = useI18n();

    const triggers = addonFoodTriggers.map(value => ({
      title: i18n.t(`survey-schemes.prompts.addon-foods-prompt.trigger.${value}`),
      value,
    }));

    return { triggers };
  },
});
</script>

<style lang="scss" scoped></style>
