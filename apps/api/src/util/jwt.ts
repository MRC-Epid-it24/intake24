import type { JwtPayload, Secret, VerifyOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

export const verify = async <T = JwtPayload>(
  token: string,
  secret: Secret,
  options?: VerifyOptions
): Promise<T | undefined> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) =>
      err ? reject(err) : resolve(decoded as T | undefined)
    );
  });
