import PasswordBcrypt from '@/util/password-bcrypt';
import PasswordShiro from '@/util/password-shiro';

export interface HashedPassword {
  hash: string;
  salt: string;
}

export interface PasswordAlgorithm {
  readonly id: string;

  hash(password: string): Promise<HashedPassword>;

  verify(input: string, hashedPassword: HashedPassword): Promise<boolean>;
}

// FIXME: Should be configurable using dependency injection, not sure how to do that properly
//        yet -- Ivan

export const supportedAlgorithms = [new PasswordBcrypt(), new PasswordShiro()];

export const defaultAlgorithm = new PasswordBcrypt();
