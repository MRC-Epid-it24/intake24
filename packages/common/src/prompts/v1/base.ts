import type { BasePortionPrompt, BasePrompt } from './prompts';

export const basePrompt: Pick<BasePrompt, 'i18n' | 'conditions' | 'actions'> = {
  i18n: {},
  conditions: [],
  actions: undefined,
};

export const basePortionPrompt: Pick<
  BasePortionPrompt,
  'i18n' | 'conditions' | 'actions' | 'badges'
> = {
  i18n: {},
  conditions: [],
  actions: undefined,
  badges: false,
};

export const promptValidation = {
  validation: {
    required: false,
    message: {},
  },
};
