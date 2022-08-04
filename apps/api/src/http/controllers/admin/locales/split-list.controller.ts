import type { Request, Response } from 'express';
import type { LocaleSplitListInput, LocaleSplitList } from '@intake24/common/types/http/admin';
import type { IoC } from '@intake24/api/ioc';

const localeSplitListController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSplitList[]>
  ): Promise<void> => {
    const { localeId } = req.params;

    const splitLists = await localeService.getSplitLists(localeId);

    res.json(splitLists);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSplitListInput[]>,
    res: Response<LocaleSplitList[]>
  ): Promise<void> => {
    const {
      body,
      params: { localeId },
    } = req;

    const splitLists = await localeService.setSplitLists(localeId, body);

    res.json(splitLists);
  };

  return {
    get,
    set,
  };
};

export default localeSplitListController;

export type LocaleSplitListController = ReturnType<typeof localeSplitListController>;
