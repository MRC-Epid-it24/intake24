<template>
  <data-table :actions="['read']" api-url="admin/fdbs" :headers="headers">
    <template #[`item.code`]="{ item }">
      <span :class="`fi fi-${item.countryFlagCode} mr-3`" />
      {{ item.code }}
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn color="secondary" icon :to="{ name: 'fdbs-food-list', params: { id: item.id } }">
        <v-icon>far fa-file</v-icon>
      </v-btn>
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'FoodDbList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('locales.code'),
          sortable: true,
          value: 'code',
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
