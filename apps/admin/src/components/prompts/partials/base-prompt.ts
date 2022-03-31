import { defineComponent, PropType } from '@vue/composition-api';
import { Condition, PromptValidationProps } from '@intake24/common/prompts';
import { LocaleTranslation } from '@intake24/common/types';
import PromptContent from './prompt-content.vue';
import PromptConditions from './prompt-conditions.vue';
import PromptValidation from './prompt-validation.vue';

export type LocaleTranslationKeys = 'name' | 'text' | 'description';

export default defineComponent({
  name: 'BasePrompt',

  components: { PromptContent, PromptConditions, PromptValidation },

  props: {
    name: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    text: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    description: {
      type: Object as PropType<LocaleTranslation>,
      required: true,
    },
    conditions: {
      type: Array as PropType<Condition[]>,
      required: true,
    },
    validation: {
      type: Object as PropType<PromptValidationProps>,
    },
  },

  methods: {
    update(field: string, value: any) {
      this.$emit(`update:${field}`, value);
    },
    updateLanguage(field: LocaleTranslationKeys, lang: string, value: any) {
      this.$emit(`update:${field}`, { ...this.$props[field], [lang]: value });
    },
  },
});
