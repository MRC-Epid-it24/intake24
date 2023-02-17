import { Client } from '@duosecurity/duo_universal';

import type { IoC } from '@intake24/api/ioc';
import type { DuoAuthChallenge } from '@intake24/common/security';
import type { MFADevice } from '@intake24/db';

export type DuoAuthenticationVerificationOps = {
  email: string;
  token: string;
};

const duoProvider = ({
  logger: globalLogger,
  securityConfig,
}: Pick<IoC, 'logger' | 'securityConfig'>) => {
  const logger = globalLogger.child({ service: 'DuoProvider' });
  const provider = 'duo';
  const config = securityConfig.mfa.providers[provider];

  /**
   * Create Duo Security authentication request
   *
   * @param {MFADevice} device
   * @returns {Promise<DuoAuthChallenge>}
   */
  const authenticationChallenge = async (device: MFADevice): Promise<DuoAuthChallenge> => {
    const { clientId, clientSecret, apiHost, redirectUrl } = config;

    try {
      if (!device.user?.email) throw new Error('Duo device with credentials not found.');

      const duoClient = new Client({
        clientId,
        clientSecret,
        apiHost,
        redirectUrl,
        useDuoCodeAttribute: false,
      });

      const { stat } = await duoClient.healthCheck();
      if (stat !== 'OK') throw new Error('Duo service not available.');

      const challengeId = duoClient.generateState();
      const challengeUrl = duoClient.createAuthUrl(device.user?.email, challengeId);

      return { challengeId, deviceId: device.id, provider, challengeUrl };
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.debug(`${name}: ${message}`, { stack });
        throw new Error(message);
      }

      throw new Error();
    }
  };

  /**
   * Verify Duo Security authentication response
   *
   * @param {DuoAuthenticationVerificationOps} ops
   * @returns
   */
  const authenticationVerification = async (ops: DuoAuthenticationVerificationOps) => {
    const { email, token } = ops;
    const { clientId, clientSecret, apiHost, redirectUrl } = config;

    try {
      const duoClient = new Client({
        clientId,
        clientSecret,
        apiHost,
        redirectUrl,
        useDuoCodeAttribute: false,
      });

      const { stat } = await duoClient.healthCheck();
      if (stat !== 'OK') throw new Error('Duo service not available.');

      return await duoClient.exchangeAuthorizationCodeFor2FAResult(token, email);
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.debug(`${name}: ${message}`, { stack });
        throw new Error(message);
      }

      throw new Error();
    }
  };

  return { authenticationChallenge, authenticationVerification };
};

export default duoProvider;

export type DuoProvider = ReturnType<typeof duoProvider>;
