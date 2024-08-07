import type { Job } from 'bullmq';
import { literal, where } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { PromptSection, RecallPrompts } from '@intake24/common/surveys';
import { Condition, customPrompts, defaultAction, getConditionDefaults, portionSizePrompts, SinglePrompt, standardPrompts } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { Survey, SurveyScheme } from '@intake24/db';

import BaseJob from '../job';
import promptMigrations from './migrations';

export default class SurveySchemesSync extends BaseJob<'SurveySchemesSync'> {
  readonly name = 'SurveySchemesSync';

  private readonly models;

  constructor({ models, logger }: Pick<IoC, 'models' | 'logger'>) {
    super({ logger });

    this.models = models;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveySchemesSync
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.synchronizeSchemes();

    this.logger.debug('Job finished.');
  }

  private migratePrompt(prompt: { version: number }, section: PromptSection): { version: number } {
    let nextMigration = promptMigrations[prompt.version];

    while (nextMigration !== undefined) {
      prompt = nextMigration(prompt, section);
      nextMigration = promptMigrations[prompt.version];
    }

    return prompt;
  }

  /*
  Some type system abuse is going on here.

  The assumption is that the structure of the survey_schemes table is rarely going to change, but the structure
  of the JSON columns (prompts, meals, data_export) can change often. Currently this mainly applies to prompts.

  These fields are typed using the latest version of RecallPrompts, Meal and ExportSection types in the
  database model class, but since Sequelize doesn't actually do any data validation other than parsing
  the JSON contents, we can check the scheme version number and assume what the contents are.

  The migration functions return an update object that will bring the JSON columns to the next (not necessarily
  immediately the latest) version. Again, since all Sequelize model does is JSON.stringify, we can feed it
  intermediate data that does not match the latest type, as long as we write the correct type in the end.
  */
  private async migrateSchemePrompts(scheme: SurveyScheme): Promise<void> {
    const prompts: RecallPrompts = {
      preMeals: scheme.prompts.preMeals.map(prompt => this.migratePrompt(prompt, 'preMeals') as unknown as SinglePrompt),
      meals: {
        preFoods: scheme.prompts.meals.preFoods.map(prompt => this.migratePrompt(prompt, 'preFoods') as unknown as SinglePrompt),
        foods: scheme.prompts.meals.foods.map(prompt => this.migratePrompt(prompt, 'foods') as unknown as SinglePrompt),
        postFoods: scheme.prompts.meals.postFoods.map(prompt => this.migratePrompt(prompt, 'postFoods') as unknown as SinglePrompt),
      },
      postMeals: scheme.prompts.postMeals.map(prompt => this.migratePrompt(prompt, 'postMeals') as unknown as SinglePrompt),
      submission: scheme.prompts.submission.map(prompt => this.migratePrompt(prompt, 'submission') as unknown as SinglePrompt),
    };

    scheme.prompts = prompts;

    await scheme.save({ fields: ['prompts'] });
  }

  private async migrateSchemeOverridePrompts(survey: Survey): Promise<void> {
    // Override prompts have no section context, but this value is only used to decide some default values
    // by the migration functions
    const prompts = survey.surveySchemeOverrides.prompts.map(prompt => this.migratePrompt(prompt, 'preMeals') as unknown as SinglePrompt);
    survey.surveySchemeOverrides = {
      ...survey.surveySchemeOverrides,
      prompts,
    };

    await survey.save({ fields: ['surveySchemeOverrides'] });
  }

  private getPromptMap() {
    return [...customPrompts, ...standardPrompts, ...portionSizePrompts].reduce<
      Record<string, SinglePrompt>
    >((acc, prompt) => {
      acc[prompt.component] = prompt;
      return acc;
    }, {});
  }

  private async synchronizeSchemes(): Promise<void> {
    this.logger.debug(`Synchronization of survey schemes started.`);

    const promptMap = this.getPromptMap();

    const mergeCallback = (prompt: SinglePrompt) => {
      const baseMerge = merge<SinglePrompt>(promptMap[prompt.component], prompt);
      return {
        ...baseMerge,
        actions: baseMerge.actions
          ? {
              ...baseMerge.actions,
              items: baseMerge.actions.items.map(action => merge(defaultAction, action)),
            }
          : undefined,
        conditions: baseMerge.conditions.map(condition => merge<Condition>(getConditionDefaults(condition.object, condition.property.id), condition)),
      };
    };

    const schemes = await this.models.system.SurveyScheme.findAll({
      attributes: ['id', 'name', 'prompts'],
      order: [['id', 'ASC']],
    });

    for (const scheme of schemes) {
      await this.migrateSchemePrompts(scheme);

      const prompts: RecallPrompts = {
        preMeals: scheme.prompts.preMeals.map(mergeCallback),
        meals: {
          preFoods: scheme.prompts.meals.preFoods.map(mergeCallback),
          foods: scheme.prompts.meals.foods.map(mergeCallback),
          postFoods: scheme.prompts.meals.postFoods.map(mergeCallback),
        },
        postMeals: scheme.prompts.postMeals.map(mergeCallback),
        submission: scheme.prompts.submission.map(mergeCallback),
      };

      await scheme.update({ prompts });
    }

    const surveys = await this.models.system.Survey.findAll({
      attributes: ['id', 'surveySchemeOverrides'],
      where: where(literal(`json_array_length(survey_scheme_overrides::json->'prompts')`), '!=', 0),
      order: [['id', 'ASC']],
    });

    for (const survey of surveys) {
      await this.migrateSchemeOverridePrompts(survey);

      await survey.update({ surveySchemeOverrides: {
        ...survey.surveySchemeOverrides,
        prompts: survey.surveySchemeOverrides.prompts.map(mergeCallback),
      } });
    }

    this.logger.debug(`Synchronization of survey schemes finished.`);
  }
}
