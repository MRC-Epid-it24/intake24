import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type {
  CreateUserResponse,
  GenerateUserResponse,
  PublicSurveyEntry,
} from '@intake24/common/types/http';
import { NotFoundError } from '@intake24/api/http/errors';
import { Survey } from '@intake24/db';

import { publicSurveyEntryResponse } from '../responses';

const surveyController = ({ surveyService }: Pick<IoC, 'surveyService'>) => {
  const browse = async (req: Request, res: Response<PublicSurveyEntry[]>): Promise<void> => {
    const surveys = await Survey.findAll({
      where: { allowGenUsers: true, genUserKey: null },
      order: [['name', 'ASC']],
    });

    res.json(surveys.map(publicSurveyEntryResponse));
  };

  const entry = async (
    req: Request<{ slug: string }>,
    res: Response<PublicSurveyEntry>
  ): Promise<void> => {
    const { slug } = req.params;

    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    res.json(publicSurveyEntryResponse(survey));
  };

  const generateUser = async (
    req: Request<{ slug: string }>,
    res: Response<GenerateUserResponse>
  ): Promise<void> => {
    const { slug } = req.params;

    const {
      respondent: { username },
      password,
    } = await surveyService.generateRespondent(slug);

    res.json({ username, password });
  };

  const createUser = async (
    req: Request<{ slug: string }>,
    res: Response<CreateUserResponse>
  ): Promise<void> => {
    const {
      params: { slug },
      body: { token },
    } = req;

    const data = await surveyService.createRespondentWithJWT(slug, token);

    res.json(data);
  };

  return {
    browse,
    entry,
    generateUser,
    createUser,
  };
};

export default surveyController;

export type SurveyController = ReturnType<typeof surveyController>;
