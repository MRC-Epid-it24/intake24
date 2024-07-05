<template>
  <v-card outlined>
    <v-toolbar color="grey lighten-4" flat>
      <v-icon left>
        fas fa-globe
      </v-icon>
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.externalSources.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-select
        :items="sources"
        :label="$t('survey-schemes.prompts.externalSources.sources._')"
        name="source"
        outlined
        :value="source.type"
        @input="update('type', $event)"
      />
      <v-combobox
        v-if="source.type === 'open-food-facts'"
        :items="countries"
        :label="$t('survey-schemes.prompts.externalSources.countries._')"
        name="country"
        outlined
        :value="source.country"
        @input="update('country', $event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';

import type { ExternalSourceOptions } from '@intake24/common/prompts';
import { defaultExternalSourceOptions, externalSources } from '@intake24/common/prompts';
import { copy } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'ExternalSourceSettings',

  props: {
    source: {
      type: Object as PropType<ExternalSourceOptions>,
      required: true,
    },
  },

  emits: ['update:source'],

  setup(props, { emit }) {
    const { i18n } = useI18n();

    const sources = externalSources.map(value => ({
      text: i18n.t(`survey-schemes.prompts.externalSources.sources.${value}`).toString(),
      value,
    }));

    const countries = computed(() => {
      return ['world'];
    });

    const update = (field: string, value: any) => {
      if (field === 'type') {
        emit('update:source', copy(defaultExternalSourceOptions[value]));
        return;
      }

      emit('update:source', { ...props.source, [field]: value });
    };

    return { countries, sources, update };
  },
});
</script>

<style lang="scss" scoped></style>
