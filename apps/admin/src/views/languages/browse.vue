<template>
  <data-table :headers="headers">
    <template #[`item.code`]="{ item }">
      <span :class="`fi fi-${item.countryFlagCode} mr-3`" />
      {{ item.code }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'LanguageList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('languages.code'),
          sortable: true,
          value: 'code',
        },
        {
          text: this.$t('languages.englishName'),
          sortable: true,
          value: 'englishName',
        },
        {
          text: this.$t('languages.localName'),
          sortable: true,
          value: 'localName',
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
