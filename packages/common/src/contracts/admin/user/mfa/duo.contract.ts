import { initContract } from '@ts-rest/core';

import {
  duoRegistrationChallenge,
  duoRegistrationVerificationRequest,
  mfaDeviceResponse,
} from '@intake24/common/types/http/admin';

export const duo = initContract().router({
  challenge: {
    method: 'GET',
    path: '/admin/user/mfa/providers/duo',
    responses: {
      200: duoRegistrationChallenge,
    },
    summary: 'Duo challenge',
    description: 'Generate a challenge for Duo multi-factor authentication',
  },
  verify: {
    method: 'POST',
    path: '/admin/user/mfa/providers/duo',
    body: duoRegistrationVerificationRequest,
    responses: {
      200: mfaDeviceResponse,
    },
    summary: 'Duo verification',
    description: 'Verify Duo multi-factor authentication challenge',
  },
});
