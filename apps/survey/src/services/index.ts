import { createFeedbackService } from '@intake24/ui/feedback';

import http from './http.service';

export { default as authService } from './auth.service';
export { default as categoriesService } from './categories.service';
export { default as foodsService } from './foods.service';
export { default as httpService } from './http.service';
export { default as surveyService } from './survey.service';
export * from './survey.service';
export { default as userService } from './user.service';
export * from './user.service';
export { tokenService } from '@intake24/ui/services';

export const feedbackService = createFeedbackService(http);
