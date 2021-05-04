<template>
  <data-table :headers="headers">
    <template v-slot:[`item.type`]="{ item }">
      {{ $t(`schemes.questions.${item.prompt.type}._`) }}
    </template>
    <template v-slot:[`item.component`]="{ item }">
      {{ $t(`schemes.prompts.${item.prompt.component}.title`) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@/components/datatable/DataTable.vue';

export default Vue.extend({
  name: 'SchemeQuestionList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('common.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('schemes.questions.type'),
          sortable: false,
          value: 'type',
        },
        {
          text: this.$t('schemes.questions.component'),
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
