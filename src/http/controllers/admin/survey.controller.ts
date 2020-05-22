import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import Locale from '@/db/models/system/locale';
import Survey, { SurveyScheme, SurveyState } from '@/db/models/system/survey';
import NotFoundError from '@/http/errors/not-found.error';

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const survey = await Survey.findByPk(id);

  if (!survey) {
    next(new NotFoundError());
    return;
  }

  const locales = await Locale.findAll({ attributes: ['id', 'englishName'] });

  res.json({ data: survey, refs: { locales, schemes: SurveyScheme, states: SurveyState } });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const { data, meta } = await Survey.paginate({
      req,
      columns: ['id'],
    });

    res.json({ data, meta });
  },

  async create(req: Request, res: Response): Promise<void> {
    res.json({ data: { id: null }, refs: {} });
  },

  async store(req: Request, res: Response): Promise<void> {
    const survey = await Survey.create(
      pick(req.body, [
        'id',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'locale',
        'allowGenUsers',
        'suspensionReason',
        'surveyMonkeyUrl',
        'supportEmail',
        'originatingUrl',
        'description',
        'feedbackEnabled',
        'feedbackStyle',
        'submissionNotificationUrl',
        'storeUserSessionOnServer',
        'numberOfSubmissionsForFeedback',
        'finalPageHtml',
      ])
    );

    res.status(201).json({ data: survey });
  },

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
    entry(req, res, next);
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    await survey.update(
      pick(req.body, [
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'locale',
        'allowGenUsers',
        'suspensionReason',
        'surveyMonkeyUrl',
        'supportEmail',
        'originatingUrl',
        'description',
        'feedbackEnabled',
        'feedbackStyle',
        'submissionNotificationUrl',
        'storeUserSessionOnServer',
        'numberOfSubmissionsForFeedback',
        'finalPageHtml',
      ])
    );

    res.json({ data: survey, refs: {} });
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const survey = await Survey.findByPk(id);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    await survey.destroy();
    res.status(204).json();
  },
};
