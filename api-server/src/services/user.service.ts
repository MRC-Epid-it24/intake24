import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import slugify from 'slugify';
import {
  CreateUserRequest,
  CreateRespondentRequest,
  UpdateUserRequest,
  UpdateRespondentRequest,
} from '@common/types/api/admin/users';
import GenUserCounter from '@/db/models/system/gen-user-counter';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import UserPassword from '@/db/models/system/user-password';
import UserRole from '@/db/models/system/user-role';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import ForbiddenError from '@/http/errors/forbidden.error';
import NotFoundError from '@/http/errors/not-found.error';
import { defaultAlgorithm } from '@/util/passwords';
import { surveyRespondent } from './acl.service';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

export const toSimpleName = (name?: string | null): string | null =>
  name ? slugify(name, { replacement: ' ', lower: true }) : null;

export default {
  async create(request: CreateUserRequest): Promise<User> {
    const { password, roles, ...rest } = request;

    const user = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await this.addRoles(user.id, roles);
    await this.createPassword(user.id, password);

    return user;
  },

  async update(userId: string | number, request: UpdateUserRequest): Promise<User> {
    const user = await User.scope('roles').findByPk(userId);

    if (!user) throw new NotFoundError();

    const { roles, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    await this.setRoles(user, roles);

    return user;
  },

  async delete(userId: string | number): Promise<void> {
    const user = await User.scope('submissions').findByPk(userId);

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    await user.destroy();
  },

  async createRespondent(
    surveyId: string,
    request: CreateRespondentRequest
  ): Promise<RespondentWithPassword> {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { password, userName, ...rest } = request;
    const { id: userId } = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await UserRole.create({ userId, role: surveyRespondent(surveyId) });
    const respondent = await UserSurveyAlias.create({
      userId,
      surveyId,
      userName,
      // TODO: implement configurable length of token
      urlAuthToken: nanoid(),
    });

    this.createPassword(userId, password);

    return { respondent, password };
  },

  async updateRespondent(
    surveyId: string,
    userId: string | number,
    request: UpdateRespondentRequest
  ): Promise<UserSurveyAlias> {
    const survey = await Survey.findByPk(surveyId);
    const user = await User.findOne({
      include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
    });

    if (!survey || !user) throw new NotFoundError();

    const { password, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    if (password) this.updatePassword(user.id, password);

    // Query ensures alias is loaded
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return user.aliases![0];
  },

  async deleteRespondent(surveyId: string, userId: string | number): Promise<void> {
    const user = await User.scope('submissions').findOne({
      where: { id: userId },
      include: [{ model: UserSurveyAlias, where: { surveyId } }],
    });

    if (!user) throw new NotFoundError();

    if (user.submissions?.length)
      throw new ForbiddenError('User cannot be deleted. It already contains submission data.');

    // System-wide account - delete only access to study
    if (user.email) {
      await UserSurveyAlias.destroy({ where: { surveyId, userId } });
      await UserRole.destroy({ where: { userId, role: surveyRespondent(surveyId) } });
    } else {
      // Wipe the whole user records
      await user.destroy();
    }
  },

  async generateRespondent(surveyId: string): Promise<RespondentWithPassword> {
    const survey = await Survey.scope('counter').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (!survey.allowGenUsers) throw new ForbiddenError();

    let { counter } = survey;
    if (counter) await counter.increment('count');
    else counter = await GenUserCounter.create({ surveyId, count: 1 });

    const userName = `${surveyId}${counter.count}`;
    const password = nanoid(8);

    return this.createRespondent(surveyId, { userName, password });
  },

  async addRoles(userId: number, roles: string[]): Promise<UserRole[]> {
    if (!roles.length) return [];

    const newRoles = roles.map((role: string) => ({ userId, role }));

    return UserRole.bulkCreate(newRoles);
  },

  async setRoles(user: User | number, roles: string[]): Promise<void> {
    const userRecord = user instanceof User ? user : await User.scope('roles').findByPk(user);

    if (!userRecord) throw new NotFoundError();
    const { id: userId } = userRecord;

    const currentRoles = userRecord.roles?.map((item) => item.role) ?? [];
    await UserRole.destroy({ where: { userId, role: { [Op.notIn]: roles } } });

    const roleRecords = roles
      .filter((role: string) => !currentRoles.includes(role))
      .map((role: string) => ({ userId, role }));

    if (roleRecords.length) await UserRole.bulkCreate(roleRecords);
  },

  async createPassword(userId: number, password: string): Promise<UserPassword> {
    const { salt, hash } = await defaultAlgorithm.hash(password);

    return UserPassword.create({
      userId,
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  },

  async updatePassword(userId: number, password: string): Promise<UserPassword> {
    const userPassword = await UserPassword.findByPk(userId);
    if (!userPassword) throw new NotFoundError();

    const { salt, hash } = await defaultAlgorithm.hash(password);

    return userPassword.update({
      passwordSalt: salt,
      passwordHash: hash,
      passwordHasher: defaultAlgorithm.id,
    });
  },
};
