<template>
  <data-table :headers="headers">
    <template v-slot:[`item.state`]="{ item }">
      {{ $t(`surveys.state.${item.state}`) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'SurveyList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('surveys.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('surveys.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('surveys.locale'),
          sortable: true,
          value: 'localeId',
        },
        {
          text: this.$t('surveys.scheme'),
          sortable: true,
          value: 'schemeId',
        },
        {
          text: this.$t('surveys.state._'),
          sortable: true,
          value: 'state',
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
