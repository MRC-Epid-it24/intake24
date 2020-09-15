import { expect } from 'chai';
import request from 'supertest';
import securityConfig from '@/config/security';

export default (): void => {
  const url = '/login/alias';

  it('Missing credentials should return 422 with errors', async function () {
    const { status, body } = await request(this.app).post(url).set('Accept', 'application/json');

    expect(status).to.equal(422);
    expect(body).to.be.an('object').to.have.keys('errors', 'success');
    expect(body.errors).to.have.keys('userName', 'password', 'surveyId');
  });

  it('Invalid credentials should return 401', async function () {
    const { status } = await request(this.app).post(url).set('Accept', 'application/json').send({
      userName: 'testRespondent',
      password: 'invalidPassword',
      surveyId: 'test-survey',
    });

    expect(status).to.equal(401);
  });

  it('Valid credentials should return 200, access token & refresh cookie', async function () {
    const res = await request(this.app).post(url).set('Accept', 'application/json').send({
      userName: 'testRespondent',
      password: 'testRespondentPassword',
      surveyId: 'test-survey',
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object').to.have.keys('accessToken');

    expect(res.get('Set-Cookie')).to.an('array').lengthOf(1);
    expect(res.get('Set-Cookie')[0].split('=')[0]).to.eq(securityConfig.jwt.cookie.name);
  });
};
