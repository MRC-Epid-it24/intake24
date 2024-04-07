import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  LocaleRecipeFoods,
  LocaleRecipeFoodsInput,
  LocaleRecipeFoodSteps,
  LocaleRecipeFoodStepsInput,
} from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

function localeRecipeFoodsController({ localeService }: Pick<IoC, 'localeService'>) {
  // getting existing recipe foods for the specified Locale ID
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleRecipeFoods[]>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });

    const recipeFoods = await localeService.getRecipeFoods(locale);

    res.json(recipeFoods);
  };

  // adding/modifying/deleting new or existing recipe foods for the specified Locale ID
  const set = async (
    req: Request<{ localeId: string }, any, LocaleRecipeFoodsInput[]>,
    res: Response<LocaleRecipeFoods[]>,
  ): Promise<void> => {
    const { body } = req;
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });
    const recipeFoods = await localeService.setRecipeFoods(locale, body);

    res.json(recipeFoods);
  };

  // getting existing recipe food steps for the specific recipe food for the specified Locale ID
  const getSteps = async (
    req: Request<{ localeId: string; recipeFoodId: string }>,
    res: Response<LocaleRecipeFoodSteps[]>,
  ): Promise<void> => {
    const { localeId, recipeFoodId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });
    const recipeFoodSteps = await localeService.getRecipeFoodSteps(locale, recipeFoodId);

    res.json(recipeFoodSteps);
  };

  // adding/modifying/deleting new or existing recipe food steps for the specific recipe food for the specified Locale ID
  const setSteps = async (
    req: Request<
      { localeId: string; recipeFoodId: string },
      any,
      { items: LocaleRecipeFoodStepsInput[] }
    >,
    res: Response<LocaleRecipeFoodSteps[]>,
  ): Promise<void> => {
    const { body } = req;
    const { localeId, recipeFoodId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });

    const recipeFoodSteps = await localeService.setRecipeFoodSteps(
      locale,
      recipeFoodId,
      body.items,
    );

    res.json(recipeFoodSteps);
  };

  return {
    get,
    getSteps,
    set,
    setSteps,
  };
}

export default localeRecipeFoodsController;

export type LocaleRecipeFoodsController = ReturnType<typeof localeRecipeFoodsController>;
