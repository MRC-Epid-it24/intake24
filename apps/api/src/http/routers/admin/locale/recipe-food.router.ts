import { initServer } from '@ts-rest/express';

import { permission } from '@intake24/api/http/middleware';
import { contract } from '@intake24/common/contracts';
import { SystemLocale } from '@intake24/db';

export function recipeFood() {
  return initServer().router(contract.admin.locale.recipeFood, {
    get: {
      middleware: [permission('locales')],
      handler: async ({ params: { localeId }, req }) => {
        const { aclService, localeService } = req.scope.cradle;

        const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
          attributes: ['id', 'code'],
          where: { id: localeId },
        });

        const recipeFoods = await localeService.getRecipeFoods(locale);

        return { status: 200, body: recipeFoods };
      },
    },
    set: {
      middleware: [permission('locales')],
      handler: async ({ body, params: { localeId }, req }) => {
        const { aclService, localeService } = req.scope.cradle;

        const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
          attributes: ['id', 'code'],
          where: { id: localeId },
        });
        const recipeFoods = await localeService.setRecipeFoods(locale, body);

        return { status: 200, body: recipeFoods };
      },
    },
    getSteps: {
      middleware: [permission('locales')],
      handler: async ({ params: { localeId, recipeFoodId }, req }) => {
        const { aclService, localeService } = req.scope.cradle;

        const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
          attributes: ['id', 'code'],
          where: { id: localeId },
        });
        const recipeFoodSteps = await localeService.getRecipeFoodSteps(locale, recipeFoodId);

        return { status: 200, body: recipeFoodSteps };
      },
    },
    setSteps: {
      middleware: [permission('locales')],
      handler: async ({ body, params: { localeId, recipeFoodId }, req }) => {
        const { aclService, localeService } = req.scope.cradle;

        const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'recipe-foods', {
          attributes: ['id', 'code'],
          where: { id: localeId },
        });

        const recipeFoodSteps = await localeService.setRecipeFoodSteps(
          locale,
          recipeFoodId,
          body.items,
        );

        return { status: 200, body: recipeFoodSteps };
      },
    },
  });
}
