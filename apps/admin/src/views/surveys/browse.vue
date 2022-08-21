<template>
  <data-table :headers="headers">
    <template #[`item.state`]="{ item }">
      {{ $t(`surveys.states.${item.state}`) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'SurveyList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('surveys.id'),
          sortable: true,
          value: 'slug',
        },
        {
          text: this.$t('surveys.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('locales._'),
          sortable: true,
          value: 'localeId',
        },
        {
          text: this.$t('surveys.states._'),
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
