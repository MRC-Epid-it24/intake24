import { initServer } from '@ts-rest/express';
import { pick } from 'lodash';

import { contract } from '@intake24/common/contracts';

export const category = () => {
  return initServer().router(contract.category, {
    browse: async ({ params, req }) => {
      const { localeId, code } = params;

      const foods = await req.scope.cradle.categoryContentsService.searchCategory(
        localeId,
        code,
        pick(req.query, ['page', 'limit', 'sort', 'search'])
      );

      return { status: 200, body: foods };
    },
    contents: async ({ params, req }) => {
      const { localeId, code } = params;

      const categoryContents = await req.scope.cradle.categoryContentsService.getCategoryContents(
        localeId,
        code
      );

      return { status: 200, body: categoryContents };
    },
    rootContents: async ({ params, req }) => {
      const { localeId } = params;

      const categoryContents =
        await req.scope.cradle.categoryContentsService.getRootCategories(localeId);

      return { status: 200, body: categoryContents };
    },
  });
};
