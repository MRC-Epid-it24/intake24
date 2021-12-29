<template>
  <data-table :headers="headers">
    <template v-slot:[`item.id`]="{ item }">
      <span :class="`flag-icon flag-icon-${item.countryFlagCode} mr-3`"></span>
      {{ item.id }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'LanguageList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('languages.id'),
          sortable: true,
          value: 'id',
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
