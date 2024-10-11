<template>
  <layout v-if="entryLoaded" v-bind="{ id, entry }">
    <embedded-data-table
      ref="table"
      :api-url="`admin/standard-units/${id}/foods`"
      :headers="headers"
    >
      <template #[`item.action`]="{ item }">
        <read
          action="read"
          :item="item"
          :to="{ name: 'fdbs-foods', params: { id: item.localeId, entryId: item.id } }"
        />
      </template>
    </embedded-data-table>
  </layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import type { StandardUnitAttributes } from '@intake24/common/types/http/admin';
import { type DataTableHeader, EmbeddedDataTable } from '@intake24/admin/components/data-tables';
import { Read } from '@intake24/admin/components/data-tables/action-bar';
import { detailMixin } from '@intake24/admin/components/entry';
import { useEntry, useEntryFetch } from '@intake24/admin/composables';
import { useI18n } from '@intake24/i18n';

export default defineComponent({
  name: 'StandardUnitFoods',

  components: { EmbeddedDataTable, Read },

  mixins: [detailMixin],

  setup(props) {
    const { i18n: { t } } = useI18n();
    const { entry, entryLoaded } = useEntry<StandardUnitAttributes>(props);
    useEntryFetch(props);

    const table = ref<InstanceType<typeof EmbeddedDataTable>>();

    const headers = ref<DataTableHeader[]>([
      {
        title: t('fdbs.foods.global.code'),
        sortable: true,
        key: 'foodCode',
      },
      {
        title: t('locales.code'),
        sortable: true,
        key: 'localeCode',
      },
      {
        title: t('fdbs.foods.local.id'),
        sortable: true,
        key: 'id',
      },
      {
        title: t('fdbs.foods.local.name'),
        sortable: true,
        key: 'name',
      },
      {
        title: t('common.action._'),
        sortable: false,
        key: 'action',
        align: 'end',
      },
    ]);

    const updateTable = async () => {
      await table.value?.fetch();
    };

    return { entry, entryLoaded, headers, table, updateTable };
  },
});
</script>

<style lang="scss" scoped></style>
