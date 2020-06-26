import Vue from 'vue';
import tinymce from '@/components/tinymce/tinymce';

export default Vue.extend({
  name: 'Prompt',

  mixins: [tinymce],

  props: {
    text: {
      type: String,
    },
    description: {
      type: String,
    },
    validation: {
      type: Object,
    },
  },

  computed: {
    textRules() {
      return [(value: string | null): boolean | string => !!value || 'Question text is required.'];
    },
  },
});
