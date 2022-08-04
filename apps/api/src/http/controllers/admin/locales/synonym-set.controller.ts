import type { Request, Response } from 'express';
import type { LocaleSynonymSetInput, LocaleSynonymSet } from '@intake24/common/types/http/admin';
import type { IoC } from '@intake24/api/ioc';

const localeSynonymSetController = ({ localeService }: Pick<IoC, 'localeService'>) => {
  const get = async (
    req: Request<{ localeId: string }>,
    res: Response<LocaleSynonymSet[]>
  ): Promise<void> => {
    const { localeId } = req.params;

    const synonymSets = await localeService.getSynonymSets(localeId);

    res.json(synonymSets);
  };

  const set = async (
    req: Request<{ localeId: string }, any, LocaleSynonymSetInput[]>,
    res: Response<LocaleSynonymSet[]>
  ): Promise<void> => {
    const {
      body,
      params: { localeId },
    } = req;

    const synonymSets = await localeService.setSynonymSets(localeId, body);

    res.json(synonymSets);
  };

  return {
    get,
    set,
  };
};

export default localeSynonymSetController;

export type LocaleSynonymSetController = ReturnType<typeof localeSynonymSetController>;
