import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import Locale from '@/db/models/system/locale';
import Scheme from '@/db/models/system/scheme';
import Survey from '@/db/models/system/survey';
import ForbiddenError from '@/http/errors/forbidden.error';
import NotFoundError from '@/http/errors/not-found.error';
import surveyResponse from '@/http/responses/admin/survey-response';

type SurveyReferences = { locales: Locale[]; schemes: Scheme[] };

const refs = async (): Promise<SurveyReferences> => {
  const locales = await Locale.findAll({ attributes: ['id', 'englishName'] });
  const schemes = await Scheme.findAll({ attributes: ['id', 'name'] });

  return { locales, schemes };
};

const entry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const survey = await Survey.findByPk(id);

  if (!survey) {
    next(new NotFoundError());
    return;
  }

  res.json({ data: surveyResponse(survey), refs: await refs() });
};

export default {
  async list(req: Request, res: Response): Promise<void> {
    const { data, meta } = await Survey.paginate({ req, columns: ['id'] });

    res.json({ data, meta });
  },

  async create(req: Request, res: Response): Promise<void> {
    res.json({ data: { id: null }, refs: await refs() });
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

    res.status(201).json({ data: surveyResponse(survey) });
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

    res.json({ data: surveyResponse(survey), refs: await refs() });
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const survey = await Survey.scope('submissions').findByPk(id);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    if (survey.submissions?.length) {
      next(new ForbiddenError('Survey cannot be deleted. It already contains submission data.'));
      return;
    }

    await survey.destroy();
    res.status(204).json();
  },
};
