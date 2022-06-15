import type { Request } from 'express';
import { Client } from '@duosecurity/duo_universal';
import { User } from '@intake24/db';
import { UnauthorizedError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { Subject } from '@intake24/common/security';
import type { LoginMeta, Tokens } from '..';
import type { MFALoginCredentials, MFAProvider, MFARequest, MFAVerifyCredentials } from '.';

const regenerate = (req: Request): Promise<void> =>
  new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      return err ? reject(err) : resolve();
    });
  });

export default ({
  jwtService,
  logger,
  securityConfig,
  signInService,
}: Pick<IoC, 'jwtService' | 'logger' | 'securityConfig' | 'signInService'>): MFAProvider => {
  const { mfa: mfaConfig } = securityConfig;

  /**
   * Get multi-factor authentication request URL
   *
   * @param {MFALoginCredentials} credentials
   * @returns {Promise<MFARedirect>}
   */
  const request = async (
    credentials: MFALoginCredentials,
    { req }: LoginMeta
  ): Promise<MFARequest> => {
    const { provider } = mfaConfig;
    const { clientId, clientSecret, apiHost, redirectUrl } = mfaConfig.providers[provider];

    const { email, userId } = credentials;
    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
    } = req;

    try {
      const duoClient = new Client({
        clientId,
        clientSecret,
        apiHost,
        redirectUrl,
        useDuoCodeAttribute: false,
      });

      const { stat } = await duoClient.healthCheck();
      if (stat !== 'OK') throw new Error('MFA: Duo service not available.');

      const state = duoClient.generateState();

      /*
       * Session is now only used for MFA authentication
       * If used elsewhere, we should not really regenerate here
       */
      await regenerate(req);
      req.session.duo = { state, email };

      const url = duoClient.createAuthUrl(email, state);

      await signInService.log({
        provider: 'email',
        providerKey: email,
        userId,
        remoteAddress,
        userAgent,
        successful: true,
      });

      return { mfaRequestUrl: url };
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.debug(stack ?? `${name}: ${message}`);
      }

      throw new UnauthorizedError();
    }
  };

  /**
   * Verify multi-factor authentication response
   *
   * @param {MFAVerifyCredentials} credentials
   * @param {LoginMeta} meta
   * @returns {Promise<Tokens>}
   */
  const verify = async (
    { code, state }: MFAVerifyCredentials,
    { req }: LoginMeta
  ): Promise<Tokens> => {
    const { provider } = mfaConfig;
    const { clientId, clientSecret, apiHost, redirectUrl } = mfaConfig.providers[provider];

    const {
      ip: remoteAddress,
      headers: { 'user-agent': userAgent },
      session: { duo: { state: sessionState, email } = {} } = {},
    } = req;

    const signInAttempt = {
      provider,
      providerKey: code,
      remoteAddress,
      userAgent,
      successful: false,
    };

    if (!sessionState || !email) {
      await signInService.log({ ...signInAttempt, message: 'MFA: missing duo session data.' });
      throw new UnauthorizedError();
    }

    if (state !== sessionState) {
      await signInService.log({ ...signInAttempt, message: 'MFA: session state mismatch.' });
      throw new UnauthorizedError();
    }

    try {
      const duoClient = new Client({
        clientId,
        clientSecret,
        apiHost,
        redirectUrl,
        useDuoCodeAttribute: false,
      });

      const { stat } = await duoClient.healthCheck();
      if (stat !== 'OK') throw new Error('MFA: Duo service not available.');

      await duoClient.exchangeAuthorizationCodeFor2FAResult(code, email);
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        logger.debug(stack ?? `${name}: ${message}`);

        await signInService.log({ ...signInAttempt, message });
      }

      throw new UnauthorizedError();
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await signInService.log({
        ...signInAttempt,
        providerKey: email,
        message: 'Credentials not found in database.',
      });

      throw new UnauthorizedError();
    }

    await signInService.log({
      ...signInAttempt,
      providerKey: email,
      userId: user.id,
      successful: true,
    });

    const subject: Subject = { provider: 'email', providerKey: email };

    return jwtService.issueTokens(user.id, subject, 'admin');
  };

  return {
    request,
    verify,
  };
};
