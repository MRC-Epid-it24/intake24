<template>
  <div>
    <h2 class="mb-4">
      {{ $t('user.profile') }}
    </h2>
    <data-table :actions="['download', 'read']" api-url="admin/user/jobs" :headers="headers">
      <template #[`item.userId`]="{ item }">
        {{ item.user?.email ?? item.userId }}
      </template>
      <template #[`item.successful`]="{ item }">
        <v-icon v-if="item.successful" color="success">
          $check
        </v-icon>
        <v-icon v-else color="error">
          $times
        </v-icon>
      </template>
      <template #[`item.startedAt`]="{ item }">
        {{ formatDateTime(item.startedAt) }}
      </template>
    </data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';
import { useDateTime } from '@intake24/admin/composables';

export default defineComponent({
  name: 'UserJobList',

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
          text: this.$t('common.type'),
          sortable: true,
          value: 'type',
        },
        {
          text: this.$t('common.startedAt'),
          sortable: true,
          value: 'startedAt',
        },
        {
          text: this.$t('common.status'),
          sortable: false,
          value: 'successful',
          align: 'center',
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
