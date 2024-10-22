import type { HashedPassword, PasswordAlgorithm } from '.';

import crypto from 'node:crypto';

export default class PasswordShiro implements PasswordAlgorithm {
  id = 'shiro-sha256';

  private readonly iterations: number;

  constructor(iterations = 1024) {
    this.iterations = iterations;
  }

  async hash(_password: string): Promise<HashedPassword> {
    return Promise.reject(new Error('Creating new SHA-256 hashed passwords is not allowed'));
  }

  async verify(input: string, hashedPassword: HashedPassword): Promise<boolean> {
    return new Promise((resolve) => {
      const hash = crypto.createHash('sha256');

      hash.update(Buffer.from(hashedPassword.salt, 'base64'));
      hash.update(input, 'utf8');

      let digest = hash.digest();

      for (let i = 0; i < this.iterations - 1; i += 1) {
        const hashInner = crypto.createHash('sha256');
        hashInner.update(digest);
        digest = hashInner.digest();
      }

      resolve(digest.compare(Buffer.from(hashedPassword.hash, 'base64')) === 0);
    });
  }
}
