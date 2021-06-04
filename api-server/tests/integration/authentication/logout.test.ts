import request from 'supertest';
import securityConfig from '@/config/security';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/auth/logout';

  it('Should return 200 and empty refresh cookie', async () => {
    const res = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toBeEmpty();
    expect(res.get('Set-Cookie')).toHaveLength(1);
    expect(res.get('Set-Cookie')[0].split(';')[0]).toEqual(`${securityConfig.jwt.cookie.name}=`);
  });
};
