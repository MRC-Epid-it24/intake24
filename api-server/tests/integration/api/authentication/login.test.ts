import { expect } from 'chai';
import request from 'supertest';
import securityConfig from '@/config/security';

export default (): void => {
  const url = '/login';

  it('Missing credentials should return 422 with errors', async function () {
    const { status, body } = await request(this.app).post(url).set('Accept', 'application/json');

    expect(status).to.equal(422);
    expect(body).to.be.an('object').to.have.keys('errors', 'success');
    expect(body.errors).to.have.keys('email', 'password');
  });

  it('Invalid credentials should return 401', async function () {
    const { status } = await request(this.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'invalidPassword' });

    expect(status).to.equal(401);
  });

  it('Valid credentials should return 200, access token & refresh cookie', async function () {
    const res = await request(this.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object').to.have.keys('accessToken');

    expect(res.get('Set-Cookie')).to.an('array').lengthOf(1);
    expect(res.get('Set-Cookie')[0].split('=')[0]).to.eq(securityConfig.jwt.cookie.name);
  });
};
