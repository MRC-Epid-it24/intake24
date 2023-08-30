import url from 'node:url';

import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/typescript-types';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

import type { IoC } from '@intake24/api/ioc';
import type { FIDOAuthChallenge } from '@intake24/common/security';
import { ValidationError } from '@intake24/api/http/errors';
import { randomString } from '@intake24/common/util';
import { MFAAuthenticator, MFADevice } from '@intake24/db';

export type FIDORegistrationVerificationOps = {
  userId: string;
  name: string;
  expectedChallenge: string;
  response: RegistrationResponseJSON;
};

export type FIDOAuthenticationVerificationOps = {
  authenticator: MFAAuthenticator;
  challengeId: string;
  response: AuthenticationResponseJSON;
};

const fidoProvider = ({
  db,
  appConfig,
  securityConfig,
}: Pick<IoC, 'db' | 'appConfig' | 'securityConfig'>) => {
  const provider = 'fido';
  const { issuer } = securityConfig.mfa.providers[provider];
  const rpID = url.parse(appConfig.urls.admin).hostname ?? 'localhost';
  if (!rpID) throw new Error('Cannot resolve admin domain from URL');

  const origin = appConfig.urls.admin;

  const registrationChallenge = async (
    userID: string,
    userName?: string,
    userDisplayName?: string
  ) => {
    const authenticators = await MFAAuthenticator.findAll({
      include: { association: 'device', where: { userId: userID } },
    });

    return generateRegistrationOptions({
      rpName: issuer,
      rpID,
      userID,
      userName: userName ?? userID,
      userDisplayName: userDisplayName ?? userName ?? userID,
      attestationType: 'none',
      excludeCredentials: authenticators.map((authenticator) => ({
        id: authenticator.getIdBuffer(),
        type: 'public-key',
        transports: authenticator.transports,
      })),
    });
  };

  const registrationVerification = async (ops: FIDORegistrationVerificationOps) => {
    const { userId, name, expectedChallenge, response } = ops;
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      response,
    });

    if (!verified || !registrationInfo)
      throw new ValidationError('Invalid FIDO challenge.', { path: 'response' });

    return db.system.transaction(async (transaction) => {
      const device = await MFADevice.create(
        { userId, provider: 'fido', name, secret: randomString(32) },
        { transaction }
      );

      const { credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } =
        registrationInfo;

      await MFAAuthenticator.create(
        {
          id: Buffer.from(registrationInfo.credentialID).toString('base64url'),
          deviceId: device.id,
          publicKey: credentialPublicKey,
          counter: counter.toString(),
          deviceType: credentialDeviceType,
          backedUp: credentialBackedUp,
          transports: response.response.transports ?? [],
        },
        { transaction }
      );

      return device;
    });
  };

  /**
   * Create FIDO authentication request
   *
   * @param {MFADevice} device
   * @returns {Promise<FIDOAuthChallenge>}
   */
  const authenticationChallenge = async (device: MFADevice): Promise<FIDOAuthChallenge> => {
    if (!device.authenticator) throw new Error('No FIDO authenticator found.');

    const options = await generateAuthenticationOptions({
      allowCredentials: [device.authenticator].map((authenticator) => ({
        id: authenticator.getIdBuffer(),
        type: 'public-key',
        transports: authenticator.transports,
      })),
      userVerification: 'preferred',
    });

    return { challengeId: options.challenge, deviceId: device.id, provider, options };
  };

  /**
   * Verify FIDO authentication response
   *
   * @param {FIDOAuthenticationVerificationOps} ops
   * @returns
   */
  const authenticationVerification = async (ops: FIDOAuthenticationVerificationOps) => {
    const { authenticator, challengeId, response } = ops;

    const { verified, authenticationInfo } = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challengeId,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: authenticator.getIdBuffer(),
        credentialPublicKey: authenticator.publicKey,
        counter: parseInt(authenticator.counter, 10),
        transports: authenticator.transports,
      },
    });

    if (!verified || !authenticationInfo) throw new Error('Invalid FIDO challenge.');

    return { verified, authenticationInfo };
  };

  return {
    registrationChallenge,
    registrationVerification,
    authenticationChallenge,
    authenticationVerification,
  };
};

export default fidoProvider;

export type FIDOProvider = ReturnType<typeof fidoProvider>;
