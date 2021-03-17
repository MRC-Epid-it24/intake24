<template>
  <data-table :actions="['detail', 'delete']" api="admin/jobs" :headers="headers">
    <template v-slot:[`item.user`]="{ item }">
      {{ item.user ? item.user.username : null }}
    </template>
    <template v-slot:[`item.successful`]="{ item }" class="d-flex">
      <v-icon v-if="item.successful" color="success">fa-check-circle</v-icon>
      <v-icon v-else color="error">fa-times-circle</v-icon>
    </template>
    <template v-slot:[`item.completedAt`]="{ item }">
      {{ formatDate(item.completedAt) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import FormatsDateTime from '@/mixins/FormatsDateTime';
import DataTable from '@/components/datatable/DataTable.vue';

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
          text: this.$t('common.status'),
          sortable: false,
          value: 'successful',
          align: 'center',
        },
        {
          text: this.$t('common.completedAt'),
          sortable: true,
          value: 'completedAt',
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
