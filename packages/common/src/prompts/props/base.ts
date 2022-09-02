import type { LocaleTranslation, RequiredLocaleTranslation } from '../../types';
import type { Condition } from '../conditions';

export interface BasePromptProps {
  localName: RequiredLocaleTranslation;
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
  localName: { en: 'Enter name' },
  text: {},
  description: {},
  conditions: [],
};

export const promptValidation: PromptValidationProps = {
  validation: {
    required: false,
    message: {},
  },
};
