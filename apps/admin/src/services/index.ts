import { createFeedbackService } from '@intake24/ui/feedback';
import http from './http.service';

export { tokenService } from '@intake24/ui/services';

export { default as authService } from './auth.service';
export { default as httpService } from './http.service';

export const feedbackService = createFeedbackService(http);
