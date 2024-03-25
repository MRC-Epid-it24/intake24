import { initContract } from '@ts-rest/core';

import {
  fidoRegistrationChallenge,
  fidoRegistrationVerificationRequest,
  mfaDeviceResponse,
} from '@intake24/common/types/http/admin';

export const fido = initContract().router({
  challenge: {
    method: 'GET',
    path: '/admin/user/mfa/providers/fido',
    responses: {
      200: fidoRegistrationChallenge,
    },
    summary: 'FIDO challenge',
    description: 'Generate a challenge for FIDO multi-factor authentication',
  },
  verify: {
    method: 'POST',
    path: '/admin/user/mfa/providers/fido',
    body: fidoRegistrationVerificationRequest,
    responses: {
      200: mfaDeviceResponse,
    },
    summary: 'FIDO verification',
    description: 'Verify FIDO multi-factor authentication challenge',
  },
});
