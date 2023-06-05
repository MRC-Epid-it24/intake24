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
  survey: 'Study: {name}',
  submissions: {
    _: 'Recall day',
    title: 'Recall days',
    all: 'all',
    past: 'Past recalls',
    none: 'You do not have any past recalls yet.',
    count: 'Recall number: {count}',
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
  surveyInfo: {
    recall: 'Recall: {number}',
  },
  menu: {
    title: 'Your food and drink intake',
    mealSuggested:
      'This meal is suggested by the system but you have not yet confirmed that you have had it',
    food: {
      edit: 'Edit portion size',
      encoded: 'This food has been matched with a food from our database.',
      missing: 'This food has been marked as missing in our database.',
      notMatched: 'This food has not yet been matched with a food from our database.',
      portionSizeComplete: 'Portion size estimation for this food is complete.',
      portionSizeIncomplete: 'Portion size for this food is not yet known.',
      missingInfoComplete: 'Missing information for this food is complete.',
      missingInfoIncomplete: 'Missing information for this food is not yet known.',
    },
    meal: {
      editFoods: 'Change / Add foods',
      editTime: 'Change Time',
    },
    delete: {
      _: 'Delete {item}',
      confirm: 'Do you want to delete {item}?',
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
    feedback: 'Feedback',
    next: 'Continue',
    submit: 'Submit the recall',
    addMeal: 'Add meal',
    deleteFood: 'Delete food',
    deleteMeal: 'Delete meal',
    editFood: 'Edit food',
    editMeal: 'Add foods',
    mealTime: 'Change meal time',
    nav: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      feedback: 'Feedback',
      next: 'Continue',
      redirect: 'Continue',
      remove: 'Remove',
      review: 'Review',
      submit: 'Submit',
      addMeal: 'Add meal',
      deleteFood: 'Delete food',
      deleteMeal: 'Delete meal',
      editFood: 'Edit food',
      editMeal: 'Add foods',
      mealTime: 'Meal time',
    },
  },
};

export default recall;
