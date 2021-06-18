import { SignInLog } from '@/db/models/system';
import type { IoC } from '@/ioc';
import type { SignInAttempt } from '.';

export interface SignInService {
  log: (input: SignInAttempt) => Promise<void>;
}

export default ({
  securityConfig,
  logger,
}: Pick<IoC, 'securityConfig' | 'logger'>): SignInService => {
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
