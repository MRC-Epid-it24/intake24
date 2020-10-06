<template>
  <data-table :headers="headers" api="admin/permissions">
    <template v-slot:item.createdAt="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'PermissionList',

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
          text: this.$t('common.displayName'),
          sortable: true,
          value: 'displayName',
        },
        {
          text: this.$t('common.createdAt'),
          sortable: true,
          value: 'createdAt',
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
