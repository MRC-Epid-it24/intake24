import { createFeedbackService } from '@intake24/ui/feedback';
import http from './http.service';

export { default as authService } from './auth.service';
export { default as httpService } from './http.service';
export { default as tokenService } from './token.service';

export const feedbackService = createFeedbackService(http);
