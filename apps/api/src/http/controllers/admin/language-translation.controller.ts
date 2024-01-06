import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { LanguageTranslationsResponse } from '@intake24/common/types/http/admin';
import { Language } from '@intake24/db';

const languageTranslationController = ({ languageService }: Pick<IoC, 'languageService'>) => {
  const browse = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const { languageId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Language, 'translations', {
      attributes: ['id'],
      where: { id: languageId },
    });

    const translations = await languageService.getLanguageTranslations(languageId);

    res.json(translations);
  };

  const store = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const { languageId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Language, 'translations', {
      attributes: ['id'],
      where: { id: languageId },
    });

    const translations = await languageService.getOrCreateLanguageTranslations(languageId);

    res.status(201).json(translations);
  };

  const update = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const {
      body,
      params: { languageId },
    } = req;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Language, 'translations', {
      attributes: ['id'],
      where: { id: languageId },
    });

    const translations = await languageService.updateLanguageTranslations(
      languageId,
      body.translations
    );

    res.json(translations);
  };

  const destroy = async (
    req: Request<{ languageId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { languageId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Language, 'translations', {
      attributes: ['id'],
      where: { id: languageId },
    });

    await languageService.deleteLanguageTranslations(languageId);

    res.status(204).json();
  };

  const sync = async (
    req: Request<{ languageId: string }>,
    res: Response<LanguageTranslationsResponse>
  ): Promise<void> => {
    const { languageId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Language, 'translations', {
      attributes: ['id'],
      where: { id: languageId },
    });

    await languageService.syncLanguageTranslations(languageId);
    const translations = await languageService.getLanguageTranslations(languageId);

    res.status(201).json(translations);
  };

  return {
    browse,
    store,
    update,
    destroy,
    sync,
  };
};

export default languageTranslationController;

export type LanguageTranslationController = ReturnType<typeof languageTranslationController>;
