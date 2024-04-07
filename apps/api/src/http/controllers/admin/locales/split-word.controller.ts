import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LocaleSplitWord, LocaleSplitWordInput } from '@intake24/common/types/http/admin';
import { SystemLocale } from '@intake24/db';

function localeSplitWordController({ localeService }: Pick<IoC, 'localeService'>) {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSplitWord[]>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'split-words', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });

    const splitWords = await localeService.getSplitWords(locale);

    res.json(splitWords);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSplitWordInput[]>,
    res: Response<LocaleSplitWord[]>,
  ): Promise<void> => {
    const { body } = req;
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'split-words', {
      attributes: ['id', 'code'],
      where: { id: localeId },
    });
    const splitWords = await localeService.setSplitWords(locale, body);

    res.json(splitWords);
  };

  return {
    get,
    set,
  };
}

export default localeSplitWordController;

export type LocaleSplitWordController = ReturnType<typeof localeSplitWordController>;
