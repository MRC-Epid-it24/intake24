<template>
  <data-table :headers="headers" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { DataTable, type DataTableHeader } from '@intake24/admin/components/data-tables';
import { useI18n } from '@intake24/i18n';

defineOptions({ name: 'UserList' });

const { i18n: { t } } = useI18n();

const headers = ref<DataTableHeader[]>([
  {
    title: t('users.name'),
    sortable: true,
    key: 'name',
  },
  {
    title: t('common.email'),
    sortable: true,
    key: 'email',
  },
  {
    title: t('common.action._'),
    sortable: false,
    key: 'action',
    align: 'end',
  },
]);
</script>
