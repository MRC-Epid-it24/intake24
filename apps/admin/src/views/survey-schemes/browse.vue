<template>
  <data-table :headers="headers" />
</template>

<script lang="ts" setup>
import { DataTable } from '@intake24/admin/components/data-tables';
import type { DataTableHeader } from '@intake24/admin/components/data-tables';
import { useI18n } from '@intake24/i18n';

defineOptions({ name: 'SurveySchemeList' });

const { i18n: { t } } = useI18n();

const headers: DataTableHeader[] = [
  {
    title: t('common.name'),
    sortable: true,
    key: 'name',
  },
  {
    title: t('survey-schemes.settings.types._'),
    sortable: true,
    key: 'settings.type',
  },
  {
    title: t('common.action._'),
    sortable: false,
    key: 'action',
    align: 'end',
  },
];
</script>
