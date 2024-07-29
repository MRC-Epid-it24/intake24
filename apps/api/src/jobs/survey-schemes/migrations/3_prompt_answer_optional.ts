import { Prompt, SinglePrompt } from '@intake24/common/prompts';
import { Condition } from '@intake24/common/prompts/conditions';
import { SurveyScheme } from '@intake24/db';

function migrateCondition(condition: Condition): Condition {
  switch (condition.property.type) {
    case 'promptAnswer':
      return {
        object: condition.object,
        property: {
          id: condition.property.id,
          type: condition.property.type,
          check: {
            promptId: condition.property.check.promptId,
            op: condition.property.check.op,
            value: condition.property.check.value,
            required: condition.property.check.required === undefined ? true : condition.property.check.required,
          },
        },
      };
    default:
      return condition;
  }
}

function migrateSinglePrompt(prompt: SinglePrompt): SinglePrompt {
  const conditions = prompt.conditions.map(condition => migrateCondition(condition));

  return {
    ...prompt,
    conditions,
  };
}

function migratePrompt(prompt: Prompt): Prompt {
  if (prompt.component === 'multi-prompt') {
    const subPrompts = prompt.prompts.map(p => migrateSinglePrompt(p));
    return {
      ...prompt,
      prompts: subPrompts,
      conditions: prompt.conditions.map(condition => migrateCondition(condition)),
    };
  }
  else {
    return migrateSinglePrompt(prompt);
  }
}

function migrateScheme(scheme: SurveyScheme): object {
  const prompts = {
    preMeals: scheme.prompts.preMeals.map(prompt => migratePrompt(prompt)),
    meals: {
      preFoods: scheme.prompts.meals.preFoods.map(prompt => migratePrompt(prompt)),
      foods: scheme.prompts.meals.foods.map(prompt => migratePrompt(prompt)),
      postFoods: scheme.prompts.meals.postFoods.map(prompt => migratePrompt(prompt)),
    },
    postMeals: scheme.prompts.postMeals.map(prompt => migratePrompt(prompt)),
    submission: scheme.prompts.submission.map(prompt => migratePrompt(prompt)),
  };

  return {
    version: 3,
    prompts,
  };
}

export default migrateScheme;
