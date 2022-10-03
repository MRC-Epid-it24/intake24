import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleSynonymSet, LocaleSynonymSetInput } from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeSynonymSetController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSynonymSet[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'synonym-sets', req);
    const synonymSets = await localeService.getSynonymSets(locale);

    res.json(synonymSets);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSynonymSetInput[]>,
    res: Response<LocaleSynonymSet[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'synonym-sets', req);
    const synonymSets = await localeService.setSynonymSets(locale, body);

    res.json(synonymSets);
  };

  return {
    get,
    set,
  };
};

export default localeSynonymSetController;

export type LocaleSynonymSetController = ReturnType<typeof localeSynonymSetController>;
