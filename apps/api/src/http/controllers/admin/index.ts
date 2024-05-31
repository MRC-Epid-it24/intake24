import categories from './categories';
import fdbs from './fdbs';
import foods from './foods';
import images from './images';
import locales from './locales';
import reference from './reference.controller';
import surveyScheme from './survey-scheme.controller';
import surveySchemePrompt from './survey-scheme-prompt.controller';
import surveys from './surveys';

export * from './categories';
export * from './fdbs';
export * from './foods';
export * from './images';
export * from './locales';
export * from './reference.controller';
export * from './survey-scheme.controller';
export * from './survey-scheme-prompt.controller';
export * from './surveys';

export default {
  fdbs,
  foods,
  categories,
  images,
  surveys,
  locales,
  reference,
  surveyScheme,
  surveySchemePrompt,
};
