import { Request, Response } from 'express';
import { pick } from 'lodash';
import { WhereOptions } from 'sequelize';
import config from '@/config/acl';
import { Locale, Scheme, Survey, User } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import surveyResponse from '@/http/responses/admin/survey.response';
import { staffSuffix } from '@/services/acl.service';
import {
  CreateSurveyResponse,
  SurveyResponse,
  SurveyRefs,
  SurveysResponse,
  StoreSurveyResponse,
} from '@common/types/http/admin/surveys';

const refs = async (): Promise<SurveyRefs> => {
  const locales = await Locale.findAll();
  const schemes = await Scheme.findAll({ attributes: ['id', 'name'] });

  return { locales, schemes };
};

const entry = async (req: Request, res: Response<SurveyResponse>): Promise<void> => {
  const { surveyId } = req.params;
  const survey = await Survey.findByPk(surveyId);

  if (!survey) throw new NotFoundError();

  res.json({ data: surveyResponse(survey), refs: await refs() });
};

export default {
  async list(req: Request, res: Response<SurveysResponse>): Promise<void> {
    const permissions = (req.user as User).allPermissions().map((permission) => permission.name);

    const where: WhereOptions = {};
    if (!permissions.includes(config.permissions.surveyadmin)) {
      const surveys = permissions
        .filter((permission) => permission.endsWith(staffSuffix))
        .map((permission) => permission.replace(staffSuffix, ''));

      where.id = surveys;
    }

    const surveys = await Survey.paginate({ req, columns: ['id'], where });

    res.json(surveys);
  },

  async create(req: Request, res: Response<CreateSurveyResponse>): Promise<void> {
    res.json({ refs: await refs() });
  },

  async store(req: Request, res: Response<StoreSurveyResponse>): Promise<void> {
    const survey = await Survey.create(
      pick(req.body, [
        'id',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
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
        'maximumDailySubmissions',
        'maximumTotalSubmissions',
        'minimumSubmissionInterval',
      ])
    );

    res.status(201).json({ data: surveyResponse(survey) });
  },

  async detail(req: Request, res: Response<SurveyResponse>): Promise<void> {
    entry(req, res);
  },

  async edit(req: Request, res: Response<SurveyResponse>): Promise<void> {
    entry(req, res);
  },

  async update(req: Request, res: Response<SurveyResponse>): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    await survey.update(
      pick(req.body, [
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
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
        'maximumDailySubmissions',
        'maximumTotalSubmissions',
        'minimumSubmissionInterval',
      ])
    );

    res.json({ data: surveyResponse(survey), refs: await refs() });
  },

  async delete(req: Request, res: Response<undefined>): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope('submissions').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (survey.submissions?.length)
      throw new ForbiddenError('Survey cannot be deleted. It already contains submission data.');

    await survey.destroy();

    res.status(204).json();
  },
};
