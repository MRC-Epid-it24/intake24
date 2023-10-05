import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  LocaleRecipeFoods,
  LocaleRecipeFoodsInput,
  LocaleRecipeFoodSteps,
  LocaleRecipeFoodStepsInput,
} from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeRecipeFoodsController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  // getting existing recipe foods for the specified Locale ID
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleRecipeFoods[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoods = await localeService.getRecipeFoods(locale);

    res.json(recipeFoods);
  };

  // adding/modifying/deleting new or existing recipe foods for the specified Locale ID
  const set = async (
    req: Request<{ localeId: string }, any, LocaleRecipeFoodsInput[]>,
    res: Response<LocaleRecipeFoods[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoods = await localeService.setRecipeFoods(locale, body);

    res.json(recipeFoods);
  };

  //getting existing recipe food steps for the specific recipe food for the specified Locale ID
  const getSteps = async (
    req: Request<{ localeId: string; recipeFoodId: string }>,
    res: Response<LocaleRecipeFoodSteps[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoodId = req.params.recipeFoodId;
    const recipeFoodSteps = await localeService.getRecipeFoodSteps(locale, recipeFoodId);

    res.json(recipeFoodSteps);
  };

  // adding/modifying/deleting new or existing recipe food steps for the specific recipe food for the specified Locale ID
  const setSteps = async (
    req: Request<{ localeId: string; recipeFoodId: string }, any, LocaleRecipeFoodStepsInput[]>,
    res: Response<LocaleRecipeFoodSteps[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'recipe-foods', req);
    const recipeFoodId = req.params.recipeFoodId;
    const recipeFoodSteps = await localeService.setRecipeFoodSteps(locale, recipeFoodId, body);

    res.json(recipeFoodSteps);
  };

  return {
    get,
    getSteps,
    set,
    setSteps,
  };
};

export default localeRecipeFoodsController;

export type LocaleRecipeFoodsController = ReturnType<typeof localeRecipeFoodsController>;
