import { Views } from '@/types/vue-router';
import detail from './Detail.vue';
import form from './Form.vue';
import list from './List.vue';
import questions from './Questions.vue';
import dataExport from './DataExport.vue';

export default {
  detail,
  create: form,
  edit: form,
  list,
  questions,
  'data-export': dataExport,
} as Views;
