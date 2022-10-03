import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleSplitWord, LocaleSplitWordInput } from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const localeSplitWordController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSplitWord[]>
  ): Promise<void> => {
    const locale = await getAndCheckAccess(SystemLocale, 'split-words', req);
    const splitWords = await localeService.getSplitWords(locale);

    res.json(splitWords);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSplitWordInput[]>,
    res: Response<LocaleSplitWord[]>
  ): Promise<void> => {
    const { body } = req;

    const locale = await getAndCheckAccess(SystemLocale, 'split-words', req);
    const splitWords = await localeService.setSplitWords(locale, body);

    res.json(splitWords);
  };

  return {
    get,
    set,
  };
};

export default localeSplitWordController;

export type LocaleSplitWordController = ReturnType<typeof localeSplitWordController>;
