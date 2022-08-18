import { createFeedbackService } from '@intake24/ui/feedback';

import http from './http.service';

export { default as authService } from './auth.service';
export * from './exceptions';
export { default as httpService } from './http.service';
export { tokenService } from '@intake24/ui/services';

export const feedbackService = createFeedbackService(http);
