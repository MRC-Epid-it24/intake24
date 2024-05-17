import categories from './categories';
import fdbs from './fdbs';
import feedbackScheme from './feedback-scheme.controller';
import foods from './foods';
import images from './images';
import language from './language.controller';
import languageTranslation from './language-translation.controller';
import locales from './locales';
import reference from './reference.controller';
import surveyScheme from './survey-scheme.controller';
import surveySchemePrompt from './survey-scheme-prompt.controller';
import surveys from './surveys';

export * from './categories';
export * from './fdbs';
export * from './feedback-scheme.controller';
export * from './foods';
export * from './images';
export * from './language.controller';
export * from './language-translation.controller';
export * from './locales';
export * from './reference.controller';
export * from './securable.controller';
export * from './survey-scheme.controller';
export * from './survey-scheme-prompt.controller';
export * from './surveys';

export default {
  fdbs,
  foods,
  categories,
  images,
  surveys,
  feedbackScheme,
  language,
  languageTranslation,
  locales,
  reference,
  surveyScheme,
  surveySchemePrompt,
};
