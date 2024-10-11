<template>
  <data-table :headers="headers" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { DataTable, type DataTableHeader } from '@intake24/admin/components/data-tables';
import { useI18n } from '@intake24/i18n';

defineOptions({ name: 'FeedbackSchemeList' });

const { i18n: { t } } = useI18n();

const headers = ref<DataTableHeader[]>([
  {
    title: t('common.name'),
    sortable: true,
    key: 'name',
  },
  {
    title: t('feedback-schemes.types._'),
    sortable: true,
    key: 'type',
  },
  {
    title: t('common.action._'),
    sortable: false,
    key: 'action',
    align: 'end',
  },
]);
</script>
