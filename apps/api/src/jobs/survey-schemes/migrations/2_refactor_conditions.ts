import { Condition as ConditionV2 } from '@intake24/common/prompts/conditions';
import { Prompt as PromptV2, SinglePrompt as SinglePromptV2 } from '@intake24/common/prompts/prompts';
import { Condition as ConditionV1 } from '@intake24/common/prompts/v1/conditions';
import { Prompt as PromptV1, SinglePrompt as SinglePromptV1 } from '@intake24/common/prompts/v1/prompts';
import { PromptSection } from '@intake24/common/surveys';
import { SurveyScheme } from '@intake24/db';

function defaultObjectForSection(section: PromptSection): any {
  switch (section) {
    case 'preMeals':
      return 'survey';
    case 'postMeals':
      return 'survey';
      break;
    case 'submission':
      return 'survey';
      break;
    case 'preFoods':
      return 'meal';
      break;
    case 'foods':
      return 'food';
      break;
    case 'postFoods':
      return 'meal';
      break;
  }
}

function migrateCondition(condition: ConditionV1, section: PromptSection): ConditionV2 {
  switch (condition.type) {
    case 'drinks':
      return {
        orPrevious: false,
        object: 'meal',
        property: {
          id: 'drinks',
          type: 'boolean',
          check: {
            value: false,
          },
        },
      };
    case 'energy':
      return {
        orPrevious: false,
        object: condition.props.section ?? defaultObjectForSection(section),
        property: {
          id: 'energy',
          type: 'value',
          check: {
            op: condition.op,
            value: condition.value,
          },
        },
      };
    case 'flag':
      return {
        orPrevious: false,
        object: condition.props.section ?? defaultObjectForSection(section),
        property: {
          id: 'flag',
          type: 'flag',
          check: {
            flagId: Array.isArray(condition.value) ? condition.value[0].toString() : condition.toString(),
            value: true,
          },
        },
      };
    case 'foodCategory':
      return {
        orPrevious: false,
        object: 'food',
        property: {
          id: 'foodCategory',
          type: 'value',
          check: {
            op: condition.op,
            value: condition.value,
          },
        },
      };
    case 'meals':
      return {
        orPrevious: false,
        object: 'survey',
        property: {
          id: 'numberOfMeals',
          type: 'value',
          check: {
            op: condition.op,
            value: condition.value,
          },
        },
      };
    case 'promptAnswer':
      return {
        orPrevious: false,
        object: condition.props.section ?? defaultObjectForSection(section),
        property: {
          id: 'promptAnswer',
          type: 'promptAnswer',
          check: {
            promptId: condition.props.promptId,
            op: condition.op,
            value: condition.value,
            required: true,
          },
        },
      };
    case 'property':
      switch (condition.props.name) {
        case 'recallNumber':
          return {
            orPrevious: false,
            object: 'survey',
            property: {
              id: 'recallNumber',
              type: 'value',
              check: {
                op: condition.op,
                value: condition.value,
              },
            },
          };
        case 'userName':
          return {
            orPrevious: false,
            object: 'survey',
            property: {
              id: 'userName',
              type: 'value',
              check: {
                op: condition.op,
                value: condition.value,
              },
            },
          };
      }
      break; // TSC correctly detects this as unreachable but ESLint whines about case fallthrough
    case 'recallNumber':
      return {
        orPrevious: false,
        object: 'survey',
        property: {
          id: 'recallNumber',
          type: 'value',
          check: {
            op: condition.op,
            value: condition.value,
          },
        },
      };
    default:
      // Just a sense check in case incoming type is not what we expect
      throw new Error(`Migrating conditions from v1 to v2: unexpected v1 condition type ${(condition as ConditionV1).type} in (${JSON.stringify(condition)})`);
  }
}

function migrateSinglePrompt(prompt: SinglePromptV1, section: PromptSection): SinglePromptV2 {
  const conditions = prompt.conditions.map(condition => migrateCondition(condition, section));

  switch (prompt.component) {
    case 'missing-food-prompt': {
      return {
        ...prompt,
        useGraph: false,
        conditions,
        barcode: { type: 'none' },
      };
    }
    default:
      return {
        ...prompt,
        useGraph: false,
        conditions,
      };
  }
}

function migratePrompt(prompt: PromptV1, section: PromptSection): PromptV2 {
  if (prompt.component === 'multi-prompt') {
    const subPrompts = prompt.prompts.map(p => migrateSinglePrompt(p, section));
    return {
      ...prompt,
      prompts: subPrompts,
      useGraph: false,
      conditions: prompt.conditions.map(condition => migrateCondition(condition, section)),
    };
  }
  else {
    return migrateSinglePrompt(prompt, section);
  }
}

function migrateScheme(scheme: SurveyScheme): object {
  const prompts = {
    preMeals: scheme.prompts.preMeals.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'preMeals')),
    meals: {
      preFoods: scheme.prompts.meals.preFoods.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'preFoods')),
      foods: scheme.prompts.meals.foods.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'foods')),
      postFoods: scheme.prompts.meals.postFoods.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'postFoods')),
    },
    postMeals: scheme.prompts.postMeals.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'postMeals')),
    submission: scheme.prompts.submission.map(prompt => migratePrompt(prompt as unknown as PromptV1, 'submission')),
  };

  return {
    version: 2,
    prompts,
  };
}

export default migrateScheme;
