<template>
  <data-table :headers="headers"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@intake24/admin/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'FeedbackSchemeList',

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
          text: this.$t('feedback-schemes.types._'),
          sortable: true,
          value: 'type',
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
