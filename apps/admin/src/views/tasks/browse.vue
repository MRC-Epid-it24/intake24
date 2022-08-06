<template>
  <data-table :headers="headers">
    <template v-slot:[`item.active`]="{ item }">
      <v-icon v-if="item.active" color="success">fa-check-circle</v-icon>
      <v-icon v-else color="error">fa-times-circle</v-icon>
    </template>
    <template v-slot:[`item.schedule`]="{ item }">
      {{ readableCron(item.cron) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import cronstrue from 'cronstrue';
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
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
          text: this.$t('tasks.schedule'),
          sortable: false,
          value: 'schedule',
        },
        {
          text: this.$t('tasks.cron'),
          sortable: false,
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

  methods: {
    readableCron(cron: string): string {
      return cronstrue.toString(cron, { use24HourTimeFormat: true });
    },
  },
});
</script>
