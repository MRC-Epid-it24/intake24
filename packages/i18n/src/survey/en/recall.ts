import type { LocaleMessageObject } from 'vue-i18n';

const recall: LocaleMessageObject = {
  _: 'Recall',
  info: 'Recall information',
  none: 'The is no recall in progress at the moment.',
  inProgress: 'There is a recall in progress started at: {startedAt}.',
  limitReached: {
    daily: 'You have reached the daily limit of recalls.',
    total: 'You have reached the total limit of recalls.',
  },
  submissions: {
    _: 'Recall day',
    title: 'Recall days',
    all: 'all',
    past: 'Past recalls',
    none: 'You do not have any past recalls yet.',
  },
  start: 'Start',
  continue: 'Continue',
  submit: 'Submit the recall',
  submittedAt: 'Submitted at',
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
  contextMenu: {
    close: 'Close',
    select: 'Continue with {name}',
    editFoods: 'Revise foods',
    delete: 'Delete {name}',
    confirmDeletion: "Are you sure you want to delete '{name}'?",
    confirm: 'Confirm {name}',
    changeTime: 'Change time',
  },
  actions: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    next: 'Continue',
    remove: 'Remove',
    review: 'Review',
    addMeal: 'Add meal',
    editFoods: 'Edit meal',
    deleteMeal: 'Delete meal',
    mealTime: 'Meal time',
  },
};

export default recall;
