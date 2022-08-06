import type { IoC } from '@intake24/api/ioc';
import { SignInLog } from '@intake24/db';

import type { SignInAttempt } from '.';

const signInService = ({
  securityConfig,
  logger: globalLogger,
}: Pick<IoC, 'securityConfig' | 'logger'>) => {
  const logger = globalLogger.child({ service: 'SignInService' });

  const log = async (input: SignInAttempt): Promise<void> => {
    logger.debug(
      `SignInService: Login attempt, Provider: ${input.provider}, ProviderKey: ${input.providerKey}`
    );

    if (!securityConfig.signInLog.enabled) return;

    await SignInLog.create(input);
  };

  return {
    log,
  };
};

export default signInService;

export type SignInService = ReturnType<typeof signInService>;
