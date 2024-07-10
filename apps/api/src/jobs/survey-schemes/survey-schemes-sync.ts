import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import type { ExportSection, Meal, RecallPrompts } from '@intake24/common/surveys';
import { portionSizePrompts, SinglePrompt, standardPrompts } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';
import { SurveyScheme } from '@intake24/db';

import BaseJob from '../job';
import migrations from './migrations';

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
  private async applyMigrations(scheme: SurveyScheme): Promise<void> {
    let nextMigration = migrations[scheme.version];

    while (nextMigration !== undefined) {
      const schemeUpdateRequest = nextMigration(scheme);
      await scheme.update({ version: schemeUpdateRequest.version, meals: schemeUpdateRequest.meals as Meal[], prompts: schemeUpdateRequest.prompts as RecallPrompts, dataExport: schemeUpdateRequest.dataExport as ExportSection[] });
      nextMigration = migrations[scheme.version];
    }
  }

  private getPromptMap() {
    return [...standardPrompts, ...portionSizePrompts].reduce<
      Record<string, SinglePrompt>
    >((acc, prompt) => {
      acc[prompt.component] = prompt;
      return acc;
    }, {});
  }

  private async synchronizeSchemes(): Promise<void> {
    this.logger.debug(`Synchronization of survey schemes started.`);

    const promptMap = this.getPromptMap();

    const schemes = await this.models.system.SurveyScheme.findAll({
      attributes: ['id', 'name', 'prompts', 'version'],
      order: [['id', 'ASC']],
    });

    const mergeCallback = (prompt: SinglePrompt) => merge<SinglePrompt>(promptMap[prompt.component], prompt);

    for (const scheme of schemes) {
      await this.applyMigrations(scheme);

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

      await scheme.update({ version: scheme.version, prompts });
    }

    this.logger.debug(`Synchronization of survey schemes finished.`);
  }
}
