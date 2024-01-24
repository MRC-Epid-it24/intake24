<template>
  <data-table :actions="['read', 'delete']" :headers="headers">
    <template #[`item.successful`]="{ item }">
      <v-icon v-if="item.successful" color="success">$check</v-icon>
      <v-icon v-else color="error">$times</v-icon>
    </template>
    <template #[`item.date`]="{ item }">
      {{ formatDateTime(item.date) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';
import { useDateTime } from '@intake24/admin/composables';

export default defineComponent({
  name: 'SignInLogList',

  components: { DataTable },

  setup() {
    const { formatDateTime } = useDateTime();

    return {
      formatDateTime,
    };
  },

  data() {
    return {
      headers: [
        {
          text: this.$t('common.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('users.id'),
          sortable: true,
          value: 'userId',
        },
        {
          text: this.$t('sign-in-logs.provider'),
          sortable: true,
          value: 'provider',
        },
        {
          text: this.$t('sign-in-logs.providerKey'),
          sortable: true,
          value: 'providerKey',
        },
        {
          text: this.$t('sign-in-logs.successful'),
          sortable: false,
          value: 'successful',
        },
        {
          text: this.$t('sign-in-logs.date'),
          sortable: true,
          value: 'date',
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
