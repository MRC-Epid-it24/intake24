<template>
  <data-table :headers="headers"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataTable } from '@intake24/admin/components/data-tables';

export default Vue.extend({
  name: 'UserList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('users.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('users.email'),
          sortable: true,
          value: 'email',
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
