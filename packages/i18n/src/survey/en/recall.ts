import type { LocaleMessageObject } from 'vue-i18n';

const recall: LocaleMessageObject = {
  _: 'Recall',
  info: 'Recall information',
  none: 'No recall in progress at the moment.',
  startedAt: 'Recall started at: {startedAt}.',
  finishedAt: 'Recall finished at: {finishedAt}.',
  submittedAt: 'Submitted at',
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
  start: {
    _: 'Start',
    another: 'Start another',
  },
  continue: 'Continue',
  abort: {
    _: 'Abort',
    label: 'Abort recall',
    confirm: 'Abort current recall?',
  },
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
    editMeal: 'Revise foods',
    delete: 'Delete {name}',
    confirmDeletion: "Are you sure you want to delete '{name}'?",
    confirm: 'Confirm {name}',
    changeTime: 'Change time',
  },
  actions: {
    feedback: 'Go to feedback',
    next: 'Continue',
    submit: 'Submit the recall',
    addMeal: 'Add meal',
    deleteFood: 'Delete food',
    deleteMeal: 'Delete meal',
    editMeal: 'Add foods',
    nav: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      feedback: 'Feedback',
      next: 'Continue',
      remove: 'Remove',
      review: 'Review',
      submit: 'Submit',
      addMeal: 'Add meal',
      deleteFood: 'Delete food',
      deleteMeal: 'Delete meal',
      editMeal: 'Add foods',
      mealTime: 'Meal time',
    },
  },
};

export default recall;
