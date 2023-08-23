<template>
  <data-table :actions="['read']" :api-url="`admin/fdbs`" :headers="headers">
    <template #[`item.code`]="{ item }">
      <span :class="`fi fi-${item.countryFlagCode} mr-3`"></span>
      {{ item.code }}
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn color="secondary" icon :to="{ name: 'fdbs-read', params: { id: item.id } }">
        <v-icon>far fa-file</v-icon>
      </v-btn>
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';
import { formatsDateTime } from '@intake24/admin/mixins';

export default defineComponent({
  name: 'FoodDbList',

  components: { DataTable },

  mixins: [formatsDateTime],

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
