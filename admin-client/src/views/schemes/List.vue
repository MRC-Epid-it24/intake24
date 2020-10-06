<template>
  <data-table :headers="headers" api="admin/schemes"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'SchemeList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('schemes.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('schemes.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('schemes.types._'),
          sortable: true,
          value: 'type',
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
