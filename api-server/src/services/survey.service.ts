import { nanoid } from 'nanoid';
import GenUserCounter from '@/db/models/system/gen-user-counter';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import UserPassword from '@/db/models/system/user-password';
import UserRole from '@/db/models/system/user-role';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import NotFoundError from '@/http/errors/not-found.error';
import ForbiddenError from '@/http/errors/forbidden.error';
import { defaultAlgorithm } from '@/util/passwords';

export type GeneratedUser = {
  userName: string;
  password: string;
};

export default {
  async createRespondent(surveyId: string, userName: string): Promise<GeneratedUser> {
    const { id: userId } = await User.create({});

    await UserRole.create({ userId, role: `${surveyId}/respondent` });
    await UserSurveyAlias.create({ userId, surveyId, userName, urlAuthToken: nanoid() });

    const password = nanoid(8);

    const { salt, hash } = await defaultAlgorithm.hash(password);
    await UserPassword.create({
      userId,
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });

    return { userName, password };
  },

  async generateRespondent(surveyId: string): Promise<GeneratedUser> {
    const survey = await Survey.scope('counter').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (!survey.allowGenUsers) throw new ForbiddenError();

    let { counter } = survey;
    if (counter) await counter.increment('count');
    else counter = await GenUserCounter.create({ surveyId, count: 1 });

    const userName = `${surveyId}${counter.count}`;
    return this.createRespondent(surveyId, userName);
  },
};
