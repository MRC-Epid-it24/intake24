<template>
  <data-table :headers="headers">
    <template v-slot:[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataTable } from '@intake24/admin/components/data-tables';

export default Vue.extend({
  name: 'RoleList',

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
