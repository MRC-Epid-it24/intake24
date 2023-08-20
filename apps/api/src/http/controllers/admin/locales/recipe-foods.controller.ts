import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleRecipeFoods, LocaleRecipeFoodsInput } from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeRecipeFoodsController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleRecipeFoods[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoods = await localeService.getRecipeFoods(locale);

    res.json(recipeFoods);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleRecipeFoodsInput[]>,
    res: Response<LocaleRecipeFoods[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoods = await localeService.setRecipeFoods(locale, body);

    res.json(recipeFoods);
  };

  return {
    get,
    set,
  };
};

export default localeRecipeFoodsController;

export type LocaleRecipeFoodsController = ReturnType<typeof localeRecipeFoodsController>;
