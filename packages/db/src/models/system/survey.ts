import {
  AfterCreate,
  AfterDestroy,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  HasMany,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import {
  SearchSortingAlgorithm,
  SurveyAttributes,
  SurveyCreationAttributes,
  SurveyState,
} from '@intake24/common/types/models';
import { defaultOverrides, SchemeOverrides } from '@intake24/common/schemes';
import { surveyPermissions } from '@intake24/common/security';
import BaseModel from '../model';
import {
  ClientErrorReport,
  FeedbackScheme,
  GenUserCounter,
  SystemLocale,
  Permission,
  SurveyScheme,
  SurveySubmission,
  UserSecurable,
  UserSurveySession,
  UserSurveyAlias,
  User,
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
export default class Survey
  extends BaseModel<SurveyAttributes, SurveyCreationAttributes>
  implements SurveyAttributes
{
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public slug!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public state!: SurveyState;

  @Column({
    allowNull: false,
  })
  public startDate!: Date;

  @Column({
    allowNull: false,
  })
  public endDate!: Date;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public surveySchemeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public allowGenUsers!: boolean;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  public genUserKey!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public authUrlDomainOverride!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(128),
  })
  public authUrlTokenCharset!: string | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public authUrlTokenLength!: number | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public suspensionReason!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public surveyMonkeyUrl!: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public supportEmail!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public originatingUrl!: string | null;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public feedbackSchemeId!: string | null;

  @Column({
    allowNull: false,
    defaultValue: 1,
  })
  public numberOfSubmissionsForFeedback!: number;

  @Column({
    allowNull: true,
    type: DataType.STRING(2048),
  })
  public submissionNotificationUrl!: string | null;

  @Column({
    allowNull: false,
  })
  public storeUserSessionOnServer!: boolean;

  @Column({
    allowNull: false,
    defaultValue: 3,
  })
  public maximumDailySubmissions!: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public maximumTotalSubmissions!: number | null;

  @Column({
    allowNull: false,
    defaultValue: 600,
  })
  public minimumSubmissionInterval!: number;

  @Column({
    allowNull: false,
    defaultValue: 'paRules',
    type: DataType.STRING(10),
  })
  public searchSortingAlgorithm!: SearchSortingAlgorithm;

  @Column({
    allowNull: false,
    defaultValue: 20,
    type: DataType.INTEGER,
  })
  public searchMatchScoreWeight!: number;

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
    allowNull: true,
    type: DataType.BIGINT,
  })
  public ownerId!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'ownerId')
  public owner?: User | null;

  @HasMany(() => ClientErrorReport, 'surveyId')
  public clientErrors?: ClientErrorReport[];

  @HasOne(() => GenUserCounter, 'surveyId')
  public counter?: GenUserCounter;

  @BelongsTo(() => FeedbackScheme, 'feedbackSchemeId')
  public feedbackScheme?: FeedbackScheme;

  @BelongsTo(() => SystemLocale, 'localeId')
  public locale?: SystemLocale;

  @BelongsTo(() => SurveyScheme, 'surveySchemeId')
  public surveyScheme?: SurveyScheme;

  @HasMany(() => UserSurveyAlias, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: 'surveyId',
  })
  public respondents?: UserSurveyAlias[];

  @HasMany(() => UserSurveySession, 'surveyId')
  public sessions?: UserSurveySession[];

  @HasMany(() => SurveySubmission, 'surveyId')
  public submissions?: SurveySubmission[];

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
  public securableUsers?: User[];

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'Survey' },
  })
  public securables?: UserSecurable[];

  @AfterCreate
  static async createSurveyPermissions(instance: Survey): Promise<void> {
    const permissions = surveyPermissions(instance.id).map((item) => ({
      name: item,
      displayName: item,
      description: `Survey-specific permission (${item})`,
    }));

    await Permission.bulkCreate(permissions);
  }

  @AfterDestroy
  static async destroySurveyPermissions(instance: Survey): Promise<void> {
    await Permission.destroy({ where: { name: surveyPermissions(instance.id) } });
  }

  // TODO: add BulkAfterCreate & BulkAfterDestroy if/when implemented in system
}
