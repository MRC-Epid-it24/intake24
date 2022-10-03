import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleSplitList, LocaleSplitListInput } from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeSplitListController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSplitList[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'split-lists', req);
    const splitLists = await localeService.getSplitLists(locale);

    res.json(splitLists);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSplitListInput[]>,
    res: Response<LocaleSplitList[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'split-lists', req);
    const splitLists = await localeService.setSplitLists(locale, body);

    res.json(splitLists);
  };

  return {
    get,
    set,
  };
};

export default localeSplitListController;

export type LocaleSplitListController = ReturnType<typeof localeSplitListController>;
