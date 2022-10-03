<template>
  <data-table :headers="headers">
    <template #[`item.locale`]="{ item }">
      {{ item.locale.code }}
    </template>
    <template #[`item.surveyScheme`]="{ item }">
      {{ item.surveyScheme.name }}
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
          text: this.$t('common.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('locales._'),
          sortable: true,
          value: 'locale',
        },
        {
          text: this.$t('survey-schemes._'),
          sortable: true,
          value: 'surveyScheme',
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
