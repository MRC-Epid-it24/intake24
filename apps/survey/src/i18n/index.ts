import { merge } from '@intake24/common/util';
import { i18n } from '@intake24/i18n';
import enShared from '@intake24/i18n/shared/en';
import enSurvey from '@intake24/i18n/survey/en';

i18n.setLocaleMessage('en', merge(enShared, enSurvey));

export default i18n;
