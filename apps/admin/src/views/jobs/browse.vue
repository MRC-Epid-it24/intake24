<template>
  <data-table :actions="['read', 'delete']" :headers="headers">
    <template v-slot:[`item.user`]="{ item }">
      {{ item.user ? item.user.email : null }}
    </template>
    <template v-slot:[`item.successful`]="{ item }">
      <v-icon v-if="item.successful" color="success">fa-check-circle</v-icon>
      <v-icon v-else color="error">fa-times-circle</v-icon>
    </template>
    <template v-slot:[`item.startedAt`]="{ item }">
      {{ formatDate(item.startedAt) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import FormatsDateTime from '@intake24/admin/mixins/formats-date-time';
import DataTable from '@intake24/admin/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'JobList',

  components: { DataTable },

  mixins: [FormatsDateTime],

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
          text: this.$t('users._'),
          sortable: true,
          value: 'user',
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
