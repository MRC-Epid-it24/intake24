export interface MealTime {
  hours: number;
  minutes: number;
}

export interface PortionSize {
  servingWeight: number;
  leftoversWeight: number;
  portionWeight: number;
  method: string;
  data: [key: string];
}

export interface Food {
  id: number;
  code: string;
  englishDescription: string;
  localDescription: string[];
  searchTerm: string;
  nutrientTableId: string;
  nutrientTableCode: string;
  isReadyMeal: boolean;
  portionSize: PortionSize;
  reasonableAmount: boolean;
  foodGroupId: number;
  brand: string;
  fields: [key: string];
  nutrients: [key: number];
  customData: [key: string];
}

export interface MissingFood {
  name: string;
  brand: string;
  description: string;
  portionSize: string;
  leftovers: string;
}

export interface Meal {
  id: number;
  name: string;
  time: MealTime;
  customData: [key: string];
  foods: Food[];
  missingFoods: MissingFood[];
}

export interface SurveySubmission {
  id: string;
  userId: number;
  userAlias: string[];
  userCustomData: [key: string];
  surveyCustomData: [key: string];
  startTime: Date;
  endTime: Date;
  submissionTime: Date;
  meals: Meal[];
}
