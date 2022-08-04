import type { Request, Response } from 'express';
import type { LocaleSplitWord, LocaleSplitWordInput } from '@intake24/common/types/http/admin';
import type { IoC } from '@intake24/api/ioc';

const localeSplitWordController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSplitWord[]>
  ): Promise<void> => {
    const { localeId } = req.params;

    const splitWords = await localeService.getSplitWords(localeId);

    res.json(splitWords);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSplitWordInput[]>,
    res: Response<LocaleSplitWord[]>
  ): Promise<void> => {
    const {
      body,
      params: { localeId },
    } = req;

    const splitWords = await localeService.setSplitWords(localeId, body);

    res.json(splitWords);
  };

  return {
    get,
    set,
  };
};

export default localeSplitWordController;

export type LocaleSplitWordController = ReturnType<typeof localeSplitWordController>;
