import { SignInLog } from '@api/db/models/system';
import type { IoC } from '@api/ioc';
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
