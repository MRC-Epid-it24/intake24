<template>
  <v-card border flat>
    <v-toolbar color="grey-lighten-4">
      <v-icon icon="fas fa-globe" start />
      <v-toolbar-title>
        {{ $t('survey-schemes.prompts.externalSources.title') }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-select
        :items="sources"
        :label="$t('survey-schemes.prompts.externalSources.sources._')"
        :model-value="source.type"
        name="source"
        variant="outlined"
        @update:model-value="update('type', $event)"
      />
      <template v-if="source.type === 'open-food-facts'">
        <v-combobox

          :items="countries"
          :label="$t('survey-schemes.prompts.externalSources.countries._')"
          :model-value="source.country"
          name="country"
          variant="outlined"
          @update:model-value="update('country', $event)"
        />
        <v-toolbar flat tile>
          <v-toolbar-title class="font-weight-medium">
            <div class="text-h5">
              {{ $t('common.options._') }}
            </div>
          </v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" size="small" :title="$t('common.options.add')" @click.stop="addQuery">
            <v-icon size="small">
              $add
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider />
        <v-list-item
          v-for="(item, idx) in query"
          :key="item.key"
          link
          :ripple="false"
        >
          <div class="d-flex flex-row align-stretch ga-2">
            <v-text-field
              v-model="item.key"
              density="compact"
              hide-details="auto"
              :label="$t('common.options.key')"
              variant="outlined"
            />
            <v-text-field
              v-model="item.value"
              density="compact"
              hide-details="auto"
              :label="$t('common.options.value')"
              variant="outlined"
            />
          </div>
          <template #append>
            <v-list-item-action>
              <v-btn color="error" icon="$delete" :title="$t('common.options.remove')" @click.stop="removeQuery(idx)" />
            </v-list-item-action>
          </template>
        </v-list-item>
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent, ref, watch } from 'vue';

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
      title: i18n.t(`survey-schemes.prompts.externalSources.sources.${value}`),
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

    // Each external sources should be extracted to a separate component
    const query = ref(Object.entries(props.source.query).map(([key, value]) => ({ key, value })));
    const addQuery = () => {
      query.value.push({ key: `key-${query.value.length}`, value: `value-${query.value.length}` });
    };

    const removeQuery = (index: number) => {
      query.value.splice(index, 1);
    };

    watch(query, () => {
      emit('update:source', { ...props.source, query: query.value.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}) });
    }, { deep: true });

    return { countries, query, sources, update, addQuery, removeQuery };
  },
});
</script>

<style lang="scss" scoped></style>
