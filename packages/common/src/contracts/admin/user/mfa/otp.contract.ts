import { initContract } from '@ts-rest/core';

import {
  mfaDeviceResponse,
  otpRegistrationChallenge,
  otpRegistrationVerificationRequest,
} from '@intake24/common/types/http/admin';

export const otp = initContract().router({
  challenge: {
    method: 'GET',
    path: '/admin/user/mfa/providers/otp',
    responses: {
      200: otpRegistrationChallenge,
    },
    summary: 'OTP challenge',
    description: 'Generate a challenge for OTP multi-factor authentication',
  },
  verify: {
    method: 'POST',
    path: '/admin/user/mfa/providers/otp',
    body: otpRegistrationVerificationRequest,
    responses: {
      200: mfaDeviceResponse,
    },
    summary: 'OTP verification',
    description: 'Verify OTP multi-factor authentication challenge',
  },
});
