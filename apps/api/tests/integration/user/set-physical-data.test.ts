import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import { UserPhysicalDataAttributes } from '@common/types/models/system';

export default (): void => {
  let url: string;

  let emptyUserPhysicalData: UserPhysicalDataAttributes;
  let createUserPhysicalData: UserPhysicalDataAttributes;
  let updateUserPhysicalData: UserPhysicalDataAttributes;

  beforeAll(async () => {
    url = '/api/user/physical-data';

    const { userId } = suite.data.system.respondent;

    emptyUserPhysicalData = {
      userId,
      sex: null,
      weightKg: null,
      heightCm: null,
      physicalActivityLevelId: null,
      birthdate: null,
      weightTarget: null,
    };

    createUserPhysicalData = {
      userId,
      sex: 'm',
      weightKg: 85,
      heightCm: 182,
      physicalActivityLevelId: null,
      birthdate: 1975,
      weightTarget: 'lose_weight',
    };

    updateUserPhysicalData = {
      userId,
      sex: 'f',
      weightKg: 72,
      heightCm: 176,
      physicalActivityLevelId: null,
      birthdate: 1981,
      weightTarget: 'keep_weight',
    };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 422 when invalid input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        sex: 'invalidGender',
        weightKg: 'notANumber',
        heightCm: ['notANumber'],
        birthdate: 'shouldBeAYear',
        physicalActivityLevelId: false,
        weightTarget: 2020,
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys([
      'sex',
      'weightKg',
      'heightCm',
      'birthdate',
      'physicalActivityLevelId',
      'weightTarget',
    ]);
  });

  it('should return 200 and empty user physical data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send(emptyUserPhysicalData);

    expect(status).toBe(200);
    expect(body).toStrictEqual(emptyUserPhysicalData);
  });

  it('should return 200 and user physical data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send(createUserPhysicalData);

    expect(status).toBe(200);
    expect(body).toStrictEqual(createUserPhysicalData);
  });

  it('should return 200 and updated user physical data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send(updateUserPhysicalData);

    expect(status).toBe(200);
    expect(body).toStrictEqual(updateUserPhysicalData);
  });
};
