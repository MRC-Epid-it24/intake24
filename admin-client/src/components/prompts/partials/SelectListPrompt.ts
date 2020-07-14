import Vue from 'vue';
import { ListOption } from '@common/types/promptProps';
import prompt from './Prompt';
import PromptListOptions from './PromptListOptions.vue';

export default Vue.extend({
  name: 'SelectListPrompt',

  components: { PromptListOptions },

  mixins: [prompt],

  props: {
    options: {
      type: Array as () => ListOption[],
      default: [],
    },
    label: {
      type: String,
    },
    other: {
      type: Boolean,
      default: true,
    },
  },

  methods: {},
});
