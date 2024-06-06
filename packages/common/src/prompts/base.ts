import type { BasePortionPrompt, BasePrompt } from './prompts';

export const basePrompt: Pick<BasePrompt, 'i18n' | 'conditions' | 'actions' | 'useGraph' | 'graph'> = {
  i18n: {},
  conditions: [],
  useGraph: false,
  graph: undefined,
  actions: undefined,
};

export const basePortionPrompt: Pick<
  BasePortionPrompt,
  'i18n' | 'conditions' | 'actions' | 'useGraph' | 'graph' | 'badges'
> = {
  i18n: {},
  conditions: [],
  actions: undefined,
  useGraph: false,
  graph: undefined,
  badges: false,
};

export const promptValidation = {
  validation: {
    required: false,
    message: {},
  },
};
