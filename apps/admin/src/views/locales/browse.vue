<template>
  <data-table :headers="headers">
    <template v-slot:[`item.id`]="{ item }">
      <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
      {{ item.id }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import { DataTable } from '@intake24/admin/components/data-tables';

export default Vue.extend({
  name: 'LocaleList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('locales.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('locales.englishName'),
          sortable: true,
          value: 'englishName',
        },
        {
          text: this.$t('locales.localName'),
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
