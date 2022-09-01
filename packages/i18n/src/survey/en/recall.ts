import type { LocaleMessageObject } from 'vue-i18n';

const recall: LocaleMessageObject = {
  _: 'Recall',
  dynamic: 'Dynamic recall flow',
  dynamicTitle: 'Intake24 dietary recall',
  submit: 'Submit the recall',
  restart: 'New recall',
  feedback: 'Go to feedback',
  menu: {
    foodSearchTooltip: 'This food has not yet been matched with a food from our database',
    foodSearchCompleteTooltip: 'This food has been matched with a food from our database',
    portionSizeTooltip: 'Portion size has not yet been estimated',
    portionSizeCompleteTooltip: 'Portion size estimation complete',
    meal: {
      editFoodInMeal: 'Edit/Change Foods',
      editMealTime: 'Edit/Change Time',
      deleteMeal: 'Delete Meal',
    },
    recall: {
      addMeal: 'Add Meal',
    },
  },
};

export default recall;
