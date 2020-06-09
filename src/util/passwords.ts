import crypto from 'crypto';
import {PasswordBcrypt} from "@/util/password-bcrypt";
import {PasswordShiro} from "@/util/password-shiro";

export interface HashedPassword {
  hash: string;
  salt: string;
}

export interface PasswordAlgorithm {
  readonly id: string;

  hash(password: string): Promise<HashedPassword>;

  verify(input: string, hashedPassword: HashedPassword): Promise<boolean>;
}

/**
 * Generate random token
 *
 * @param {number} [size=48]
 * @param {BufferEncoding} encoding
 * @returns {Promise<string>}
 */
export const generateToken = (size = 48, encoding: BufferEncoding): Promise<string> => {
  return new Promise((resolve, reject) =>
    crypto.randomBytes(size, (err, buffer) =>
      err ? reject(err) : resolve(buffer.toString(encoding))
    )
  );
};

// FIXME: Should be configurable using dependency injection, not sure how to do that properly
//        yet -- Ivan

export const supportedAlgorithms = [new PasswordBcrypt(), new PasswordShiro()];

export const defaultAlgorithm = new PasswordBcrypt();
