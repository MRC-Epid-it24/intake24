import { createFeedbackService } from '@intake24/ui/feedback';

import http from './http.service';

export { default as authService } from './auth.service';
export * from './http.service';
export { default as httpService } from './http.service';
export { errorHandler, tokenService, warnHandler } from '@intake24/ui/services';

export const feedbackService = createFeedbackService(http);
