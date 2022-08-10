import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CustomPromptAnswer,
  Dictionary,
  FoodState,
  SurveyState,
  WithKey,
} from '@intake24/common/types';
import type { SurveyFollowUpResponse } from '@intake24/common/types/http';
import type { SurveySubmissionFoodCreationAttributes } from '@intake24/common/types/models';
import { NotFoundError } from '@intake24/api/http/errors';
import { SurveySubmissionFoodCustomField } from '@intake24/db';
import {
  FeedbackScheme,
  FoodGroup,
  FoodLocal,
  Survey,
  SurveyScheme,
  SurveySubmission,
  SurveySubmissionCustomField,
  SurveySubmissionFood,
  SurveySubmissionMeal,
  SurveySubmissionMealCustomField,
} from '@intake24/db';

export type CustomAnswers<K extends string | number | symbol> = WithKey<K> & {
  name: string;
  value: string;
};

export type CollectedFoods = {
  states: FoodState[];
  inputs: SurveySubmissionFoodCreationAttributes[];
};

export type FoodCodes = { foodCodes: string[]; groupCodes: string[] };

const surveySubmissionService = ({
  cache,
  logger: globalLogger,
  scheduler,
  surveyService,
}: Pick<IoC, 'cache' | 'logger' | 'scheduler' | 'surveyService'>) => {
  const logger = globalLogger.child({ service: 'surveySubmissionsService' });

  /**
   * Collect food and food group codes from submission state
   *
   * @param {FoodState[]} foods
   */
  const collectFoodCodes = (foods: FoodState[]) =>
    foods.reduce<FoodCodes>(
      (acc, food) => {
        if (food.type === 'encoded-food') {
          const {
            data: { code, groupCode },
          } = food;

          acc.foodCodes.push(code);
          acc.groupCodes.push(groupCode);
        }

        // TODO: free-text food

        if (food.linkedFoods.length) {
          const { foodCodes, groupCodes } = collectFoodCodes(food.linkedFoods);
          acc.foodCodes.push(...foodCodes);
          acc.groupCodes.push(...groupCodes);
        }

        return acc;
      },
      { foodCodes: [], groupCodes: [] }
    );

  /**
   * Collect foods from submissions state
   *
   * @param {string} mealId
   * @param {FoodLocal[]} foods
   * @param {FoodGroup[]} foodGroups
   * @returns
   */
  const collectFoods = (mealId: string, foods: FoodLocal[], foodGroups: FoodGroup[]) => {
    return (collectedFoods: CollectedFoods, foodState: FoodState) => {
      if (foodState.type === 'encoded-food') {
        const {
          data: { code, groupCode, readyMealOption, brandNames },
          linkedFoods,
          portionSize,
        } = foodState;

        const foodRecord = foods.find((foodRecord) => foodRecord.foodCode === code);
        if (!foodRecord) {
          logger.error(`Submission: food code not found (${code}), skipping...`);
          return collectedFoods;
        }

        const foodGroupRecord = foodGroups.find(
          (foodGroupRecord) => foodGroupRecord.id === groupCode
        );
        if (!foodGroupRecord) {
          logger.error(`Submission: food group code not found (${groupCode}), skipping...`);
          return collectedFoods;
        }

        if (!foodRecord.main || !foodRecord.nutrientRecords || !foodGroupRecord.localGroups)
          throw new Error('Submission: not loaded relationships');

        const {
          nutrientRecords,
          name: localName,
          main: { name: englishName },
        } = foodRecord;
        const { id: foodGroupId, name: foodGroupEnglishName, localGroups } = foodGroupRecord;

        if (!nutrientRecords.length) {
          logger.error(`Submission: Missing nutrient mapping for food code (${code}), skipping...`);
          return collectedFoods;
        }

        const [nutrient] = nutrientRecords;

        collectedFoods.inputs.push({
          mealId,
          code,
          englishName,
          localName,
          readyMeal: readyMealOption,
          searchTerm: '???', // TODO
          portionSizeMethodId: portionSize ? portionSize.method : '???', // TODO
          reasonableAmount: true, // TODO
          foodGroupId,
          foodGroupEnglishName,
          foodGroupLocalName: localGroups[0]?.name ?? foodGroupEnglishName,
          brand: brandNames.join(' '),
          nutrientTableId: nutrient.nutrientTableId,
          nutrientTableCode: nutrient.nutrientTableRecordId,
        });
        collectedFoods.states.push(foodState);

        if (linkedFoods.length) {
          const { states, inputs } = linkedFoods.reduce(collectFoods(mealId, foods, foodGroups), {
            inputs: [],
            states: [],
          });
          collectedFoods.inputs.push(...inputs);
          collectedFoods.states.push(...states);
        }
      }

      return collectedFoods;
    };
  };

  /**
   * Collect custom prompt answers as custom fields
   *
   * @template T
   * @param {T} idName
   * @param {string} id
   * @param {Dictionary<CustomPromptAnswer>} promptAnswers
   * @param {string[]} promptQuestions
   * @returns {CustomAnswers<T>[]}
   */
  const collectCustomAnswers = <T extends 'surveySubmissionId' | 'mealId' | 'foodId'>(
    idName: T,
    id: string,
    promptAnswers: Dictionary<CustomPromptAnswer>,
    promptQuestions: string[]
  ): CustomAnswers<T>[] => {
    const customAnswers = Object.entries(promptAnswers)
      .filter(([questionId]) => promptQuestions.includes(questionId))
      .map(([questionId, answer]) => ({
        [idName]: id,
        name: questionId,
        value: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
      }));

    return customAnswers as CustomAnswers<T>[];
  };

  /**
   * Process survey state and submit recall
   *
   * @param {string} slug
   * @param {string} userId
   * @param {SurveyState} surveyState
   * @returns {Promise<void>}
   */
  const submit = async (
    slug: string,
    userId: string,
    surveyState: SurveyState
  ): Promise<SurveyFollowUpResponse> => {
    const survey = await Survey.findOne({
      where: { slug },
      include: [{ model: SurveyScheme, required: true }, { model: FeedbackScheme }],
    });
    if (!survey || !survey.surveyScheme) throw new NotFoundError();

    const {
      id: surveyId,
      localeId,
      surveyScheme: {
        questions: {
          preMeals,
          postMeals,
          meals: { foods, preFoods, postFoods },
        },
      },
      submissionNotificationUrl,
    } = survey;

    const surveyCustomQuestions = [...preMeals, ...postMeals]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    const mealCustomQuestions = [...preFoods, ...postFoods]
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    const foodCustomQuestions = foods
      .filter((question) => question.type === 'custom')
      .map((question) => question.id);

    /*
     * TODO: this could be pushed to background job
     * - store state in DB for processing, processed as job, deleted successfully process data or mark as an issue in Admin Tool to reconcile
     * - response to user is not delayed by processing bigger amount of data
     * - it depends, whether we want to throw any errors / discrepancies back to user
     * - all submission data should be validated in frontend, user probably won't be able to do any corrections unless specifically allowed?
     * - critical data (inserted in DB) should be also validated in backend
     */

    // Survey submission
    const { id: surveySubmissionId } = await SurveySubmission.create({
      id: randomUUID(),
      surveyId,
      userId,
      startTime: surveyState.startTime ?? new Date(),
      endTime: surveyState.endTime ?? new Date(),
      uxSessionId: randomUUID(), // TODO: verify this
      submissionTime: new Date(),
    });

    // Survey custom fields - top-level questions
    const surveyCustomFieldInputs = collectCustomAnswers(
      'surveySubmissionId',
      surveySubmissionId,
      surveyState.customPromptAnswers,
      surveyCustomQuestions
    );

    // Survey meals
    const mealInputs = surveyState.meals.map(({ name: { en: name }, time }) => ({
      surveySubmissionId,
      name,
      hours: time?.hours ?? 8,
      minutes: time?.minutes ?? 0,
    }));

    await Promise.all([
      SurveySubmissionCustomField.bulkCreate(surveyCustomFieldInputs),
      SurveySubmissionMeal.bulkCreate(mealInputs),
    ]);

    const meals = await SurveySubmissionMeal.findAll({
      where: { surveySubmissionId },
      order: [['id', 'ASC']],
    });

    const { foodCodes, groupCodes } = surveyState.meals.reduce<FoodCodes>(
      (acc, meal) => {
        const { foodCodes, groupCodes } = collectFoodCodes(meal.foods);
        acc.foodCodes.push(...foodCodes);
        acc.groupCodes.push(...groupCodes);

        return acc;
      },
      { foodCodes: [], groupCodes: [] }
    );

    const [foodRecords, foodGroups] = await Promise.all([
      FoodLocal.findAll({
        where: { foodCode: foodCodes, localeId },
        include: [
          { association: 'main' },
          { association: 'nutrientRecords', through: { attributes: [] } },
        ],
      }),
      FoodGroup.findAll({
        where: { id: groupCodes },
        include: [{ association: 'localGroups', where: { localeId }, required: false }],
      }),
    ]);

    for (const [idx, mealState] of surveyState.meals.entries()) {
      const { id: mealId } = meals[idx];

      // Meal custom fields - meal-level questions
      const mealCustomFieldInputs = collectCustomAnswers(
        'mealId',
        mealId,
        mealState.customPromptAnswers,
        mealCustomQuestions
      );

      // Meal foods
      const collectedFoods = mealState.foods.reduce(collectFoods(mealId, foodRecords, foodGroups), {
        inputs: [],
        states: [],
      });

      await Promise.all([
        SurveySubmissionMealCustomField.bulkCreate(mealCustomFieldInputs),
        SurveySubmissionFood.bulkCreate(collectedFoods.inputs),
      ]);

      const foods = await SurveySubmissionFood.findAll({
        where: { mealId },
        order: [['id', 'ASC']],
      });

      for (const [idx, foodState] of collectedFoods.states.entries()) {
        const { id: foodId } = foods[idx];

        // Food custom fields - food-level questions
        const foodCustomFieldInputs = collectCustomAnswers(
          'foodId',
          foodId,
          foodState.customPromptAnswers,
          foodCustomQuestions
        );

        await Promise.all([
          SurveySubmissionFoodCustomField.bulkCreate(foodCustomFieldInputs),
          // TODO: PSMs
          // TODO: Nutrients
          // TODO: Fields
        ]);
      }
    }

    // Clean user submissions cache and dispatch submission webhook if any
    await Promise.all(
      [
        cache.forget(`user:submissions:${userId}`),
        submissionNotificationUrl
          ? scheduler.jobs.addJob(
              { type: 'SurveySubmissionNotification', userId },
              { surveyId, submissionId: surveySubmissionId }
            )
          : null,
      ].map(Boolean)
    );

    const [followUpUrl, showFeedback] = await Promise.all([
      surveyService.getFollowUpUrl(survey, userId),
      surveyService.canShowFeedback(survey, userId),
    ]);

    return { followUpUrl, showFeedback };
  };

  return {
    submit,
  };
};

export default surveySubmissionService;

export type SurveySubmissionService = ReturnType<typeof surveySubmissionService>;
