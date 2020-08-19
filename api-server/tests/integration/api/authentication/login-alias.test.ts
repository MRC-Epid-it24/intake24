import { expect } from 'chai';
import request from 'supertest';
import securityConfig from '@/config/security';

export default (): void => {
  const url = '/login/alias';

  it('Missing credentials should return 422 with errors', async function () {
    const res = await request(this.app).post(url).set('Accept', 'application/json');

    expect(res.status).to.equal(422);
    expect(res.body).to.be.an('object').to.have.keys('errors', 'success');
    expect(res.body.errors).to.have.keys('userName', 'password', 'surveyId');
  });

  it('Invalid credentials should return 401', async function () {
    const res = await request(this.app).post(url).set('Accept', 'application/json').send({
      userName: 'invalidUsername',
      password: 'invalidPassword',
      surveyId: 'invalidSurvey',
    });

    expect(res.status).to.equal(401);
  });

  it('Valid credentials should return 200, access token & refresh cookie', async function () {
    const res = await request(this.app).post(url).set('Accept', 'application/json').send({
      userName: 'validUsername',
      password: 'validPassword',
      surveyId: 'validSurvey',
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object').to.have.keys('accessToken');

    expect(res.get('Set-Cookie')).to.an('array').lengthOf(1);
    expect(res.get('Set-Cookie')[0].split('=')[0]).to.eq(securityConfig.jwt.cookie.name);
  });
};
