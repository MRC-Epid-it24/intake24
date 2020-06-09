import {PasswordAlgorithm, HashedPassword} from "@/util/passwords";
import crypto from 'crypto';


export class PasswordShiro implements PasswordAlgorithm {
  id = "shiro-sha256";

  private _iterations: number;

  constructor(iterations: number = 1024) {
    this._iterations = iterations;
  }

  async hash(password: string): Promise<HashedPassword> {
    return Promise.reject('Creating new SHA-256 hashed passwords is not allowed');
  }

  async verify(input: string, hashedPassword: HashedPassword): Promise<boolean> {
    return new Promise((resolve) => {
      const hash = crypto.createHash('sha256');

      hash.update(Buffer.from(hashedPassword.salt, 'base64'));
      hash.update(input, 'utf8');

      let digest = hash.digest();

      for (let i = 0; i < this._iterations - 1; ++i) {
        let hash = crypto.createHash('sha256');
        hash.update(digest);
        digest = hash.digest();
      }

      resolve(digest.compare(Buffer.from(hashedPassword.hash, 'base64')) == 0)
    });
  }
}
