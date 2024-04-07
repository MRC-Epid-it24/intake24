<template>
  <data-table :headers="headers" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'NutrientUnitList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('nutrient-units.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('common.description'),
          sortable: true,
          value: 'description',
        },
        {
          text: this.$t('nutrient-units.symbol'),
          sortable: true,
          value: 'symbol',
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
