import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  AfterCreate,
  AfterDestroy,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  HasOne,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type {
  SchemeOverrides,
  SearchSortingAlgorithm,
  SurveyState,
} from '@intake24/common/surveys';
import { surveyPermissions } from '@intake24/common/security';
import { defaultOverrides } from '@intake24/common/surveys';

import BaseModel from '../model';
import {
  ClientErrorReport,
  FeedbackScheme,
  GenUserCounter,
  Permission,
  SurveyScheme,
  SurveySubmission,
  SystemLocale,
  User,
  UserSecurable,
  UserSurveyAlias,
  UserSurveySession,
} from '.';

@Scopes(() => ({
  counter: { include: [{ model: GenUserCounter }] },
  locale: { include: [{ model: SystemLocale }] },
  feedbackScheme: { include: [{ model: FeedbackScheme }] },
  surveyScheme: { include: [{ model: SurveyScheme }] },
  respondents: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
  clientErrors: { include: [{ model: ClientErrorReport }] },
}))
@Table({
  modelName: 'Survey',
  tableName: 'surveys',
  freezeTableName: true,
  underscored: true,
})
export default class Survey extends BaseModel<
  InferAttributes<Survey>,
  InferCreationAttributes<Survey>
> {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare slug: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  declare state: SurveyState;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare startDate: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare endDate: Date;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare surveySchemeId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare localeId: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare allowGenUsers: boolean;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  declare genUserKey: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare authUrlDomainOverride: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.STRING(128),
  })
  declare authUrlTokenCharset: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  declare authUrlTokenLength: CreationOptional<number | null>;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare suspensionReason: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare surveyMonkeyUrl: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare supportEmail: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare originatingUrl: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare feedbackSchemeId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  declare numberOfSubmissionsForFeedback: CreationOptional<number>;

  @Column({
    allowNull: true,
    type: DataType.STRING(2048),
  })
  declare submissionNotificationUrl: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare storeUserSessionOnServer: boolean;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 3,
  })
  declare maximumDailySubmissions: CreationOptional<number>;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  declare maximumTotalSubmissions: CreationOptional<number | null>;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 600,
  })
  declare minimumSubmissionInterval: CreationOptional<number>;

  @Column({
    allowNull: false,
    defaultValue: 'popularity',
    type: DataType.STRING(32),
  })
  declare searchSortingAlgorithm: CreationOptional<SearchSortingAlgorithm>;

  @Column({
    allowNull: false,
    defaultValue: 20,
    type: DataType.INTEGER,
  })
  declare searchMatchScoreWeight: CreationOptional<number>;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get surveySchemeOverrides(): SchemeOverrides {
    const val = this.getDataValue('surveySchemeOverrides') as unknown;
    return val ? JSON.parse(val as string) : defaultOverrides;
  }

  set surveySchemeOverrides(value: SchemeOverrides) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('surveySchemeOverrides', JSON.stringify(value ?? defaultOverrides));
  }

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare userPersonalIdentifiers: CreationOptional<boolean>;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare userCustomFields: CreationOptional<boolean>;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare ownerId: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User, 'ownerId')
  declare owner?: NonAttribute<User | null>;

  @HasMany(() => ClientErrorReport, 'surveyId')
  declare clientErrors?: NonAttribute<ClientErrorReport[]>;

  @HasOne(() => GenUserCounter, 'surveyId')
  declare counter?: NonAttribute<GenUserCounter>;

  @BelongsTo(() => FeedbackScheme, 'feedbackSchemeId')
  declare feedbackScheme?: NonAttribute<FeedbackScheme>;

  @BelongsTo(() => SystemLocale, 'localeId')
  declare locale?: NonAttribute<SystemLocale>;

  @BelongsTo(() => SurveyScheme, 'surveySchemeId')
  declare surveyScheme?: NonAttribute<SurveyScheme>;

  @HasMany(() => UserSurveyAlias, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: 'surveyId',
  })
  declare respondents?: NonAttribute<UserSurveyAlias[]>;

  @HasMany(() => UserSurveySession, 'surveyId')
  declare sessions?: NonAttribute<UserSurveySession[]>;

  @HasMany(() => SurveySubmission, 'surveyId')
  declare submissions?: NonAttribute<SurveySubmission[]>;

  @BelongsToMany(() => User, {
    through: {
      model: () => UserSecurable,
      unique: false,
      scope: {
        securable_type: 'Survey',
      },
    },
    foreignKey: 'securableId',
    otherKey: 'userId',
    constraints: false,
  })
  declare securableUsers?: NonAttribute<User[]>;

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'Survey' },
  })
  declare securables?: NonAttribute<UserSecurable[]>;

  @AfterCreate
  static async createSurveyPermissions(instance: Survey): Promise<void> {
    const permissions = surveyPermissions(instance.slug).map((item) => ({
      name: item,
      displayName: item,
      description: `Survey-specific permission (${item})`,
    }));

    await Permission.bulkCreate(permissions);
  }

  @AfterDestroy
  static async destroySurveyPermissions(instance: Survey): Promise<void> {
    await Permission.destroy({ where: { name: surveyPermissions(instance.slug) } });
  }

  // TODO: add BulkAfterCreate & BulkAfterDestroy if/when implemented in system
}

export type SurveyAttributes = Attributes<Survey>;
export type SurveyCreationAttributes = CreationAttributes<Survey>;

export const guardedSurveyFields = ['userPersonalIdentifiers', 'userCustomFields'] as const;

export const updateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'localeId',
  'surveySchemeId',
  'feedbackSchemeId',
  'allowGenUsers',
  'genUserKey',
  'suspensionReason',
  'supportEmail',
  'submissionNotificationUrl',
  'storeUserSessionOnServer',
  'numberOfSubmissionsForFeedback',
  'authUrlDomainOverride',
  'authUrlTokenCharset',
  'authUrlTokenLength',
  'maximumDailySubmissions',
  'maximumTotalSubmissions',
  'minimumSubmissionInterval',
  'searchSortingAlgorithm',
  'searchMatchScoreWeight',
  'surveySchemeOverrides',
] as const;

export type UpdateSurveyField = (typeof updateSurveyFields)[number];

export const createSurveyFields = ['slug', ...updateSurveyFields] as const;

export type CreateSurveyField = (typeof createSurveyFields)[number];

/* export const staffUpdateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'localeId',
  'surveySchemeId',
  'feedbackSchemeId',
  'supportEmail',
  'suspensionReason',
] as const;

export type StaffUpdateSurveyFields = typeof staffUpdateSurveyFields[number]; */

export const overridesFields = ['surveySchemeOverrides'] as const;

export type OverridesField = (typeof overridesFields)[number];
