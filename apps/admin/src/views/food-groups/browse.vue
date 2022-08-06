<template>
  <data-table :headers="headers"></data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'FoodGroupList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('common.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('common.name'),
          sortable: true,
          value: 'name',
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
