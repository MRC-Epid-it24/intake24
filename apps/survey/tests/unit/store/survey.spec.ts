import { MealState, Selection, SurveyState } from '@common/types';
import store from '@/store';

function dummyMeal(name: string): MealState {
  return {
    name,
    customPromptAnswers: {},
    defaultTime: { hours: 8, minutes: 0 },
    flags: [],
    foods: [],
    time: undefined,
  };
}

function dummyMeals(count: number): MealState[] {
  const result = [];

  for (let i = 1; i <= count; ++i) {
    result.push(dummyMeal(`Meal ${i}`));
  }

  return result;
}

function initialState(): SurveyState {
  return {
    schemeId: null,
    startTime: null,
    endTime: null,
    flags: [],
    customPromptAnswers: {},

    selection: {
      element: null,
      mode: 'auto',
    },
    meals: dummyMeals(3),
  };
}

describe('Survey store', () => {
  describe('deleteMeal', () => {
    it('should keep the same selected meal index if the selected meal comes before the deleted meal', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 0,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 1);

      expect(store.getters['survey/meals']).toHaveLength(2);
      expect(store.getters['survey/selectedMealIndex']).toBe(0);
    });

    it('should adjust selected meal index to point to the same meal if it comes after the deleted meal', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 1,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 0);

      expect(store.getters['survey/meals']).toHaveLength(2);
      expect(store.getters['survey/selectedMeal'].name).toBe('Meal 2');
    });

    it('should select the next meal if the currently selected meal is deleted', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 1,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 1);

      expect(store.getters['survey/meals']).toHaveLength(2);
      expect(store.getters['survey/selectedMeal'].name).toBe('Meal 3');
    });

    it('should select the last meal if the last meal was selected and is deleted', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 2,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 2);

      expect(store.getters['survey/meals']).toHaveLength(2);
      expect(store.getters['survey/selectedMeal'].name).toBe('Meal 2');
    });

    it('should change the selection type to meal if a food from the deleted meal was selected', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'food',
          mealIndex: 2,
          foodIndex: 0,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 2);

      expect(store.getters['survey/meals']).toHaveLength(2);

      const selection: Selection = store.getters['survey/selection'];

      if (selection.element === null) fail('selection should be null');

      expect(selection.element.type).toBe('meal');

      expect(store.getters['survey/selectedMeal'].name).toBe('Meal 2');
    });

    it('should set the selection to null if the last meal is deleted', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 2,
        },
        mode: 'auto',
      });

      store.commit('survey/deleteMeal', 0);
      store.commit('survey/deleteMeal', 0);
      store.commit('survey/deleteMeal', 0);

      expect(store.getters['survey/meals']).toHaveLength(0);
      expect(store.getters['survey/selection'].element).toBeNull();
      expect(store.getters['survey/selectedMealIndex']).toBeUndefined();
      expect(store.getters['survey/selectedMeal']).toBeUndefined();
    });

    it('should keep undo object equals to null if no meal or food was deleted', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 1,
        },
        mode: 'auto',
      });

      expect(store.getters['survey/meals']).toHaveLength(3);
      expect(store.getters['survey/undoEntity']).toBeNull();
    });

    it('should record deleted meal in undo object', () => {
      store.commit('survey/setState', initialState());

      store.commit('survey/setSelection', {
        element: {
          type: 'meal',
          mealIndex: 1,
        },
        mode: 'auto',
      });

      expect(store.getters['survey/selectedMeal'].name).toBe('Meal 2');
      store.commit('survey/deleteMeal', 1);
      expect(store.getters['survey/undoEntity'].type).toBe('meal');
      expect(store.getters['survey/undoEntity'].index).toBe(1);
      expect(store.getters['survey/undoEntity'].value.name).toBe('Meal 2');
    });
  });
});
