import Vue from 'vue';
import PromptContent from './PromptContent.vue';
import PromptValidation from './PromptValidation.vue';

export default Vue.extend({
  name: 'Prompt',

  components: { PromptContent, PromptValidation },

  props: {
    text: {
      type: Object,
    },
    description: {
      type: Object,
    },
    validation: {
      type: Object,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLocale(field: string, locale: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [locale]: value });
    },
  },
});
