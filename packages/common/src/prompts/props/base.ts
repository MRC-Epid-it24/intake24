import type { LocaleTranslation } from '../../types';
import type { Condition } from '../conditions';

export interface BasePromptProps {
  name: LocaleTranslation;
  text: LocaleTranslation;
  description: LocaleTranslation;
  conditions: Condition[];
}

export interface PromptValidationProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

export interface ValidatedPromptProps extends BasePromptProps, PromptValidationProps {}

export const basePromptProps: BasePromptProps = {
  name: { en: null },
  text: { en: null },
  description: { en: null },
  conditions: [],
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: { en: null },
  },
};
