<template>
  <data-table :headers="headers"></data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataTable } from '@intake24/admin/components/data-tables';

export default Vue.extend({
  name: 'SurveySchemeList',

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
          text: this.$t('survey-schemes.types._'),
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
