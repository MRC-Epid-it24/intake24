<template>
  <v-select
    v-model="nutrientTableId"
    class="mb-3"
    clearable
    hide-details="auto"
    item-text="description"
    item-value="id"
    :items="nutrientTables"
    :label="$t('nutrient-tables._')"
    name="nutrientTableId"
    outlined
    prepend-inner-icon="$nutrient-tables"
    @change="fetchNutrientTypes"
  />
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onMounted, ref } from 'vue';

import type { ExportField } from '@intake24/common/surveys';
import type { FoodDatabaseRefs, NutrientTablesResponse } from '@intake24/common/types/http/admin';
import { useHttp } from '@intake24/admin/services';

export default defineComponent({
  name: 'DataExportNutrients',

  props: {
    value: {
      type: Array as PropType<ExportField[]>,
      required: true,
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const http = useHttp();

    const nutrientTableId = ref<string | undefined>();
    const nutrientTables = ref<FoodDatabaseRefs['nutrientTables']>([]);

    const fetchNutrientTables = async () => {
      const {
        data: { data },
      } = await http.get<NutrientTablesResponse>('admin/references/nutrient-tables', {
        params: { limit: 1000 },
      });

      nutrientTables.value = data;
    };

    const fetchNutrientTypes = async () => {
      const {
        data: { data },
      } = await http.get<NutrientTablesResponse>('admin/references/nutrient-types', {
        params: { limit: 1000, nutrientTableId: nutrientTableId.value },
      });

      const types = data.map(({ id, description }) => ({ id, label: description }));
      emit('input', types);
    };

    onMounted(async () => {
      await fetchNutrientTables();
      await fetchNutrientTypes();
    });

    return {
      nutrientTableId,
      nutrientTables,
      fetchNutrientTypes,
    };
  },
});
</script>
