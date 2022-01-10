<template>
  <data-table :headers="headers"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@intake24/admin/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'NutrientTableList',

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
          text: this.$t('common.description'),
          sortable: true,
          value: 'description',
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
