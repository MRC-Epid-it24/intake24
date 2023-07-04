<template>
  <data-table :headers="headers">
    <template #[`item.type`]="{ item }">
      {{ $t(`survey-schemes.prompts.${item.prompt.type}._`) }}
    </template>
    <template #[`item.component`]="{ item }">
      {{ $t(`survey-schemes.prompts.${item.prompt.component}.title`) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'SchemePromptList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('survey-schemes.prompts.internal.id._'),
          sortable: true,
          value: 'promptId',
        },
        {
          text: this.$t('survey-schemes.prompts.internal.name._'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('survey-schemes.prompts.type'),
          sortable: false,
          value: 'type',
        },
        {
          text: this.$t('survey-schemes.prompts.component'),
          sortable: false,
          value: 'component',
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
