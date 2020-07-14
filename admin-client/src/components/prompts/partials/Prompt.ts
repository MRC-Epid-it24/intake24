import Vue from 'vue';
import PromptContent from './PromptContent.vue';
import PromptValidation from './PromptValidation.vue';

export default Vue.extend({
  name: 'Prompt',

  components: { PromptContent, PromptValidation },

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

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
  },
});
