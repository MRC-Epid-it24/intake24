<template>
  <data-table :headers="headers" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
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
          text: this.$t('common.email'),
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
