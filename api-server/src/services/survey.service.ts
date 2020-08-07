import { nanoid } from 'nanoid';
import { CreateRespondentRequest, UpdateRespondentRequest } from '@common/types/api/admin/users';
import GenUserCounter from '@/db/models/system/gen-user-counter';
import Permission from '@/db/models/system/permission';
import Survey from '@/db/models/system/survey';
import User from '@/db/models/system/user';
import UserSurveyAlias from '@/db/models/system/user-survey-alias';
import ForbiddenError from '@/http/errors/forbidden.error';
import NotFoundError from '@/http/errors/not-found.error';
import { surveyMgmt, surveyRespondent } from './acl.service';
import userSvc, { toSimpleName } from './user.service';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

export default {
  async getSurveyRespondentPermission(surveyId: string): Promise<Permission> {
    const name = surveyRespondent(surveyId);
    const permission = await Permission.findOrCreate({
      where: { name },
      defaults: { name, displayName: name },
    });

    return permission[0];
  },

  async getSurveyMgmtPermissions(
    surveyId: string,
    scope: string | string[] = []
  ): Promise<Permission[]> {
    return Permission.scope(scope).findAll({ where: { name: surveyMgmt(surveyId) } });
  },

  async createRespondent(
    surveyId: string,
    request: CreateRespondentRequest
  ): Promise<RespondentWithPassword> {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { password, userName, ...rest } = request;
    const user = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$add('permissions', await this.getSurveyRespondentPermission(surveyId));

    const { id: userId } = user;
    const respondent = await UserSurveyAlias.create({
      userId,
      surveyId,
      userName,
      // TODO: implement configurable length of token
      urlAuthToken: nanoid(),
    });

    userSvc.createPassword(userId, password);

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
    if (password) userSvc.updatePassword(user.id, password);

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
      await user.$remove('permissions', await this.getSurveyRespondentPermission(surveyId));
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
};
