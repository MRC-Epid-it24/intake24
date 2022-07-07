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
import { defineComponent } from 'vue';
import { DataTable } from '@intake24/admin/components/data-tables';

export default defineComponent({
  name: 'SchemeQuestionList',

  components: { DataTable },

  data() {
    return {
      headers: [
        {
          text: this.$t('survey-schemes.questions.internal.id._'),
          sortable: true,
          value: 'questionId',
        },
        {
          text: this.$t('survey-schemes.questions.internal.name._'),
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
