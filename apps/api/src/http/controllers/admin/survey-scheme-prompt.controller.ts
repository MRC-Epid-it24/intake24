import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { MealSection, SurveyPromptSection } from '@intake24/common/surveys';
import type {
  SurveySchemePromptEntry,
  SurveySchemePromptRefs,
  SurveySchemePromptsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { isMealSection } from '@intake24/common/surveys';
import { SurveyScheme, SurveySchemePrompt } from '@intake24/db';

const SurveySchemePromptController = () => {
  const entry = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<SurveySchemePromptEntry>
  ): Promise<void> => {
    const { surveySchemePromptId } = req.params;

    const schemePrompt = await SurveySchemePrompt.findByPk(surveySchemePromptId);
    if (!schemePrompt) throw new NotFoundError();

    res.json(schemePrompt);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemePromptsResponse>
  ): Promise<void> => {
    const schemePrompts = await SurveySchemePrompt.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['promptId', 'name'],
      order: [[fn('lower', col('prompt_id')), 'ASC']],
    });

    res.json(schemePrompts);
  };

  const store = async (req: Request, res: Response<SurveySchemePromptEntry>): Promise<void> => {
    const { prompt } = req.body;
    const { id: promptId, name } = prompt;

    const schemePrompt = await SurveySchemePrompt.create({ promptId, name, prompt });

    res.status(201).json(schemePrompt);
  };

  const read = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<SurveySchemePromptEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<SurveySchemePromptEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<SurveySchemePromptEntry>
  ): Promise<void> => {
    const {
      params: { surveySchemePromptId },
      body: { prompt },
    } = req;
    const { id: promptId, name } = prompt;

    const schemePrompt = await SurveySchemePrompt.findByPk(surveySchemePromptId);
    if (!schemePrompt) throw new NotFoundError();

    await schemePrompt.update({ promptId, name, prompt });

    res.json(schemePrompt);
  };

  const destroy = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveySchemePromptId } = req.params;

    const schemePrompt = await SurveySchemePrompt.findByPk(surveySchemePromptId, {
      attributes: ['id'],
    });
    if (!schemePrompt) throw new NotFoundError();

    await schemePrompt.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<SurveySchemePromptRefs>): Promise<void> => {
    const [schemes, prompts] = await Promise.all([
      SurveyScheme.findAll(),
      SurveySchemePrompt.findAll({ attributes: ['prompt'] }),
    ]);

    const promptIds = prompts.map((p) => p.prompt.id);

    res.json({ schemes, promptIds });
  };

  const sync = async (
    req: Request<{ surveySchemePromptId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { surveySchemePromptId },
      body: { surveySchemeId, prompt },
    } = req;
    const section = req.body.section as SurveyPromptSection | MealSection;

    const schemePrompt = await SurveySchemePrompt.findByPk(surveySchemePromptId, {
      attributes: ['id'],
    });
    if (!schemePrompt) throw new NotFoundError();

    const scheme = await SurveyScheme.findByPk(surveySchemeId, { attributes: ['id', 'prompts'] });
    if (!scheme) throw new NotFoundError();

    const { prompts } = scheme;
    const sectionPrompts = isMealSection(section) ? prompts.meals[section] : prompts[section];

    const match = sectionPrompts.findIndex((p) => p.id === prompt.id);
    if (match === -1) throw new NotFoundError();

    sectionPrompts.splice(match, 1, prompt);

    if (isMealSection(section)) prompts.meals[section] = sectionPrompts;
    else prompts[section] = sectionPrompts;

    await scheme.update({ prompts });

    res.json();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    sync,
  };
};

export default SurveySchemePromptController;

export type SurveySchemePromptController = ReturnType<typeof SurveySchemePromptController>;
