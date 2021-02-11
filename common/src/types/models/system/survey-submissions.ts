export type SurveySubmission = {
  id: string;
  surveyId: string;
  userId: number;
  startTime: Date;
  endTime: Date;
  submissionTime: Date;
  log: string[] | null;
  uxSessionId: string;
};

export type SurveySubmissionCustomField = {
  id: number;
  surveySubmissionId: string;
  name: string;
  value: string;
};

export type SurveySubmissionMeal = {
  id: number;
  surveySubmissionId: string;
  hours: number;
  minutes: number;
  name: string | null;
};

export type SurveySubmissionMealCustomField = {
  id: number;
  mealId: number;
  name: string;
  value: string;
};

export type SurveySubmissionFood = {
  id: number;
  mealId: number;
  code: string;
  englishDescription: string;
  localDescription: string | null;
  readyMeal: boolean;
  searchTerm: string;
  portionSizeMethodId: string;
  reasonableAmount: boolean;
  foodGroupId: number;
  foodGroupEnglishDescription: string;
  foodGroupLocalDescription: string | null;
  brand: string;
  nutrientTableId: string;
  nutrientTableCode: string;
};

export type SurveySubmissionFoodCustomField = {
  id: number;
  foodId: number;
  name: string;
  value: string;
};

export type SurveySubmissionMissingFood = {
  id: number;
  mealId: number;
  name: string;
  brand: string;
  description: string;
  portionSize: string;
  leftovers: string;
};

export type SurveySubmissionField = {
  id: number;
  foodId: number;
  fieldName: string;
  value: string;
};

export type SurveySubmissionNutrient = {
  id: number;
  foodId: number;
  amount: number;
  nutrientTypeId: number;
};

export type SurveySubmissionPortionSizeField = {
  id: number;
  foodId: number;
  name: string;
  value: string;
};
