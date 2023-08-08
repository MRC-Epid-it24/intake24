import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  LocaleSpecialFoods,
  LocaleSpecialFoodsInput,
} from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeSpecialFoodsController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSpecialFoods[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'special-foods', req);
    const specialFoods = await localeService.getSpecialFoods(locale);

    res.json(specialFoods);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSpecialFoodsInput[]>,
    res: Response<LocaleSpecialFoods[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'special-foods', req);
    const specialFoods = await localeService.setSpecialFoods(locale, body);

    res.json(specialFoods);
  };

  return {
    get,
    set,
  };
};

export default localeSpecialFoodsController;

export type LocaleSpecialFoodsController = ReturnType<typeof localeSpecialFoodsController>;
