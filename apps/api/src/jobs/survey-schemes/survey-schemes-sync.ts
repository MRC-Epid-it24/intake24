import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import type { Prompt } from '@intake24/common/prompts';
import type { RecallPrompts } from '@intake24/common/surveys';
import { customPrompts, portionSizePrompts, standardPrompts } from '@intake24/common/prompts';
import { merge } from '@intake24/common/util';

import BaseJob from '../job';

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

  private getPromptMap() {
    return [...standardPrompts, ...portionSizePrompts, ...customPrompts].reduce<
      Record<string, Prompt>
    >((acc, prompt) => {
      acc[prompt.component] = prompt;
      return acc;
    }, {});
  }

  private async synchronizeSchemes(): Promise<void> {
    this.logger.debug(`Synchronization of survey schemes started.`);

    const promptMap = this.getPromptMap();

    const schemes = await this.models.system.SurveyScheme.findAll({
      attributes: ['id', 'name', 'prompts'],
      order: [['id', 'ASC']],
    });

    const mergeCallback = (prompt: Prompt) => merge<Prompt>(promptMap[prompt.component], prompt);

    for (const scheme of schemes) {
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

    this.logger.debug(`Synchronization of survey schemes finished.`);
  }
}
