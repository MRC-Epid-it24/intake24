<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table
      ref="table"
      :api="`admin/standard-units/${id}/categories`"
      :headers="headers"
    >
      <template #[`item.action`]="{ item }">
        <read
          action="read"
          :item="item"
          :to="{ name: 'fdbs-categories', params: { id: item.localeId, entryId: item.id } }"
        >
        </read>
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { StandardUnitEntry } from '@intake24/common/types/http/admin';
import { EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { Read } from '@intake24/admin/components/data-tables/action-bar';
import { detailMixin, useStoreEntry } from '@intake24/admin/components/entry';

export default defineComponent({
  name: 'StandardUnitCategories',

  components: { EmbeddedDataTable, Read },

  mixins: [detailMixin],

  setup(props) {
    const { entry, entryLoaded } = useStoreEntry<StandardUnitEntry>(props.id);

    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    return { entry, entryLoaded, table };
  },

  data() {
    return {
      headers: [
        {
          text: this.$t('fdbs.categories.global.code'),
          sortable: true,
          value: 'categoryCode',
        },
        {
          text: this.$t('locales.code'),
          sortable: true,
          value: 'localeCode',
        },
        {
          text: this.$t('fdbs.categories.local.id'),
          sortable: true,
          value: 'id',
        },
        {
          text: this.$t('fdbs.categories.local.name'),
          sortable: true,
          value: 'name',
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

  methods: {
    async updateTable() {
      await this.table?.fetch();
    },
  },
});
</script>

<style lang="scss" scoped></style>
