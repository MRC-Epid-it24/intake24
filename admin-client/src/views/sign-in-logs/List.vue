<template>
  <data-table :actions="['detail', 'delete']" :headers="headers">
    <template v-slot:[`item.successful`]="{ item }">
      <v-icon v-if="item.successful" color="success">fa-check-circle</v-icon>
      <v-icon v-else color="error">fa-times-circle</v-icon>
    </template>
    <template v-slot:[`item.date`]="{ item }">
      {{ formatDate(item.date) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import FormatsDateTime from '@/mixins/FormatsDateTime';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'SignInLogList',

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
