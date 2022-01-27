<template>
  <data-table :headers="headers">
    <template v-slot:[`item.type`]="{ item }">
      {{ $t(`survey-schemes.questions.${item.question.type}._`) }}
    </template>
    <template v-slot:[`item.component`]="{ item }">
      {{ $t(`survey-schemes.prompts.${item.question.component}.title`) }}
    </template>
  </data-table>
</template>

<script lang="ts">
import Vue from 'vue';
import DataTable from '@intake24/admin/components/datatable/data-table.vue';

export default Vue.extend({
  name: 'SchemeQuestionList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('survey-schemes.questions.id'),
          sortable: true,
          value: 'questionId',
        },
        {
          text: this.$t('survey-schemes.questions.name'),
          sortable: true,
          value: 'name',
        },
        {
          text: this.$t('survey-schemes.questions.type'),
          sortable: false,
          value: 'type',
        },
        {
          text: this.$t('survey-schemes.questions.component'),
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
