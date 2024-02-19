import { SystemLocale } from '@intake24/db';

import { NotFoundError } from '../http/errors';

const resolveLocale = async (localeId: string | SystemLocale): Promise<SystemLocale> => {
  const locale =
    typeof localeId === 'string'
      ? await SystemLocale.findByPk(localeId, { attributes: ['id', 'code'] })
      : localeId;
  if (!locale) throw new NotFoundError();

  return locale;
};

export { resolveLocale };
