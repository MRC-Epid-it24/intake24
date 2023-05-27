import pick from 'lodash/pick';

import { merge } from '@intake24/common/util';
import { i18n, shared, survey } from '@intake24/i18n';

const buildWithLocales = ['en'];
const locales = pick(merge(shared, survey), buildWithLocales);

for (const [locale, messages] of Object.entries(locales)) {
  i18n.setLocaleMessage(locale, messages);
}

export default i18n;
