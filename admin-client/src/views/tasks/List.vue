<template>
  <data-table :headers="headers" api="admin/tasks"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'TaskList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('common.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('tasks.job'),
          sortable: true,
          value: 'job',
        },
        {
          text: this.$t('tasks.cron'),
          sortable: true,
          value: 'cron',
        },
        {
          text: this.$t('common.action.active'),
          sortable: false,
          value: 'active',
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
