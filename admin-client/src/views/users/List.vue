<template>
  <data-table :headers="headers" api="v3/admin/users"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

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
        },
      ],
    };
  },
});
</script>
