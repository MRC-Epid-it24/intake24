import { nanoid } from 'nanoid';
import { CreateRespondentRequest, UpdateRespondentRequest } from '@common/types/http/admin/users';
import { GenUserCounter, Job, Permission, Survey, User, UserSurveyAlias } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { toSimpleName } from '@/util';
import { surveyMgmt, surveyRespondent } from './acl.service';

export type RespondentWithPassword = {
  respondent: UserSurveyAlias;
  password: string;
};

export interface SurveyService {
  getSurveyRespondentPermission: (surveyId: string) => Promise<Permission>;
  getSurveyMgmtPermissions: (surveyId: string, scope?: string | string[]) => Promise<Permission[]>;
  createRespondent: (
    surveyId: string,
    request: CreateRespondentRequest
  ) => Promise<RespondentWithPassword>;
  updateRespondent: (
    surveyId: string,
    userId: string | number,
    request: UpdateRespondentRequest
  ) => Promise<UserSurveyAlias>;
  deleteRespondent: (surveyId: string, userId: string | number) => Promise<void>;
  generateRespondent: (surveyId: string) => Promise<RespondentWithPassword>;
  importRespondents: (surveyId: string, userId: number, file: Express.Multer.File) => Promise<Job>;
  exportAuthenticationUrls: (surveyId: string, userId: number) => Promise<Job>;
}

export default ({ scheduler, userService }: IoC): SurveyService => {
  const getSurveyRespondentPermission = async (surveyId: string): Promise<Permission> => {
    const name = surveyRespondent(surveyId);
    const [permission] = await Permission.findOrCreate({
      where: { name },
      defaults: { name, displayName: name },
    });

    return permission;
  };

  const getSurveyMgmtPermissions = async (
    surveyId: string,
    scope: string | string[] = []
  ): Promise<Permission[]> => {
    return Permission.scope(scope).findAll({ where: { name: surveyMgmt(surveyId) } });
  };

  const createRespondent = async (
    surveyId: string,
    request: CreateRespondentRequest
  ): Promise<RespondentWithPassword> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const { password, userName, ...rest } = request;
    const user = await User.create({ ...rest, simpleName: toSimpleName(rest.name) });

    await user.$add('permissions', await getSurveyRespondentPermission(surveyId));

    const { id: userId } = user;
    const respondent = await UserSurveyAlias.create({
      userId,
      surveyId,
      userName,
      // TODO: implement configurable length of token
      urlAuthToken: nanoid(),
    });

    await userService.createPassword(userId, password);

    return { respondent, password };
  };

  const updateRespondent = async (
    surveyId: string,
    userId: string | number,
    request: UpdateRespondentRequest
  ): Promise<UserSurveyAlias> => {
    const survey = await Survey.findByPk(surveyId);
    const user = await User.findOne({
      include: [{ model: UserSurveyAlias, where: { userId, surveyId } }],
    });

    if (!survey || !user) throw new NotFoundError();

    const { password, ...rest } = request;

    await user.update({ ...rest, simpleName: toSimpleName(rest.name) });
    if (password) userService.updatePassword(user.id, password);

    // Query ensures alias is loaded
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return user.aliases![0];
  };

  const deleteRespondent = async (surveyId: string, userId: string | number): Promise<void> => {
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
      await user.$remove('permissions', await getSurveyRespondentPermission(surveyId));
    } else {
      // Wipe the whole user records
      await user.destroy();
    }
  };

  const generateRespondent = async (surveyId: string): Promise<RespondentWithPassword> => {
    const survey = await Survey.scope('counter').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (!survey.allowGenUsers) throw new ForbiddenError();

    let { counter } = survey;
    if (counter) await counter.increment('count');
    else counter = await GenUserCounter.create({ surveyId, count: 1 });

    const userName = `${surveyId}${counter.count}`;
    const password = nanoid(8);

    return createRespondent(surveyId, { userName, password });
  };

  const importRespondents = async (
    surveyId: string,
    userId: number,
    file: Express.Multer.File
  ): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    return scheduler.jobs.addJob(
      { type: 'ImportSurveyRespondents', userId },
      { surveyId, file: file.path }
    );
  };

  const exportAuthenticationUrls = async (surveyId: string, userId: number): Promise<Job> => {
    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    return scheduler.jobs.addJob({ type: 'ExportSurveyRespondentAuthUrls', userId }, { surveyId });
  };

  return {
    getSurveyRespondentPermission,
    getSurveyMgmtPermissions,
    createRespondent,
    updateRespondent,
    deleteRespondent,
    generateRespondent,
    importRespondents,
    exportAuthenticationUrls,
  };
};
