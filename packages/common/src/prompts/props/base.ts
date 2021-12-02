import type { LocaleTranslation } from '../../types';
import type { Condition } from '../conditions';

export interface BasePromptProps {
  text: LocaleTranslation;
  description: LocaleTranslation;
  conditions: Condition[];
  localName: LocaleTranslation;
}

export interface PromptValidationProps {
  validation: {
    required: boolean;
    message: LocaleTranslation;
  };
}

export interface ValidatedPromptProps extends BasePromptProps, PromptValidationProps {}

export const basePromptProps: BasePromptProps = {
  text: { en: null },
  description: { en: null },
  conditions: [],
  localName: { en: null },
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: { en: null },
  },
};
