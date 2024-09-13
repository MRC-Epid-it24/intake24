import { merge } from '@intake24/common/util';
import { i18n } from '@intake24/i18n';
import enAdmin from '@intake24/i18n/admin/en';
import enShared from '@intake24/i18n/shared/en';

const messages = merge(enShared, enAdmin);
i18n.setLocaleMessage('en', messages);

export default i18n;
