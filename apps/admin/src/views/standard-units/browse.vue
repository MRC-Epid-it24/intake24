<template>
  <data-table :headers="headers" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { DataTable, type DataTableHeader } from '@intake24/admin/components/data-tables';
import { useI18n } from '@intake24/i18n';

defineOptions({ name: 'StandardUnitList' });

const { i18n: { t } } = useI18n();

const headers = ref<DataTableHeader[]>([
  {
    title: t('standard-units.id'),
    sortable: true,
    key: 'id',
  },
  {
    title: t('common.name'),
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
</script>
