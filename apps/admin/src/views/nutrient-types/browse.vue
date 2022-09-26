<template>
  <data-table :headers="headers">
    <template #[`item.unitId`]="{ item }">
      {{ item.unit.description }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'NutrientTypeList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('nutrient-types.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('common.description'),
          sortable: true,
          value: 'description',
        },
        {
          text: this.$t('nutrient-units._'),
          sortable: true,
          value: 'unitId',
        },
        {
          text: this.$t('common.action._'),
          sortable: false,
          value: 'action',
          align: 'right',
        },
      ],
    };
  },
});
</script>
