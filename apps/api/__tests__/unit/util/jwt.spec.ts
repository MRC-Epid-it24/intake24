import jsonwebtoken from 'jsonwebtoken';

import { jwt } from '@intake24/api/util';

describe('jsonwebtoken promisified wrappers', () => {
  // This is just to test the wrapper, not the implementation
  it('should verify jwt token', async () => {
    const payload = { id: 1, name: 'John' };
    const secret = 'aSuperSecret';

    const token = jsonwebtoken.sign(payload, secret);
    const decoded = await jwt.verify(token, secret);

    if (!decoded) throw new Error();

    const { iat, ...rest } = decoded;

    expect(rest).toEqual(payload);
  });
});
