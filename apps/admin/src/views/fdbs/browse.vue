<template>
  <data-table :actions="['read']" :headers="headers" :apiUrl="`admin/locales`">
    <template v-slot:[`item.id`]="{ item }">
      <span :class="`flag-icon flag-icon-${item.countryFlagCode} mr-3`"></span>
      {{ item.id }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import FormatsDateTime from '@/mixins/formats-date-time';
import DataTable from '@/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'FoodDbList',

  components: { DataTable },

  mixins: [FormatsDateTime],

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
