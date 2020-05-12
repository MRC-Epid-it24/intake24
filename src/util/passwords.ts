import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash password for storage
 *
 * @param {string} password
 * @param {number} [rounds=10]
 * @returns {Promise<string>}
 */
export const hash = async (password: string, rounds = 10): Promise<string> =>
  bcrypt.hash(password, await bcrypt.genSalt(rounds));

/**
 * Hash password for storage (sync)
 *
 * @param {string} password
 * @param {number} [rounds=10]
 * @returns {string}
 */
export const hashSync = (password: string, rounds = 10): string =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(rounds));

/**
 * Generate random token
 *
 * @param {*} [{ encoding = 'base64', size = 48 }={}]
 * @returns {Promise<string>}
 */
export const generateToken = ({ encoding = 'base64', size = 48 } = {}): Promise<string> => {
  return new Promise((resolve, reject) =>
    crypto.randomBytes(size, (err, buffer) =>
      err ? reject(err) : resolve(buffer.toString(encoding))
    )
  );
};
