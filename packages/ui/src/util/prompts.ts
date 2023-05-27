import camelCase from 'lodash/camelCase';

export const promptType = (component: string) => camelCase(component.replace('-prompt', ''));
