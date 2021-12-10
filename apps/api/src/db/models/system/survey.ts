import {
  AfterCreate,
  AfterDestroy,
  BelongsTo,
  Column,
  DataType,
  HasOne,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';
import {
  SearchSortingAlgorithm,
  SurveyAttributes,
  SurveyCreationAttributes,
  SurveyState,
} from '@common/types/models';
import { defaultOverrides, SchemeOverrides } from '@common/schemes';
import { surveyPermissions } from '@api/services/core/auth';
import BaseModel from '../model';
import {
  ClientErrorReport,
  GenUserCounter,
  Locale,
  Permission,
  Scheme,
  SurveySubmission,
  UserSession,
  UserSurveyAlias,
} from '.';

@Scopes(() => ({
  counter: { include: [{ model: GenUserCounter }] },
  locale: { include: [{ model: Locale }] },
  scheme: { include: [{ model: Scheme }] },
  respondents: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
  clientErrors: { include: [{ model: ClientErrorReport }] },
}))
@Table({
  modelName: 'Survey',
  tableName: 'surveys',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Survey
  extends BaseModel<SurveyAttributes, SurveyCreationAttributes>
  implements SurveyAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public id!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
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
    type: DataType.STRING(64),
  })
  public schemeId!: string;

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

  // V4 Deprecated
  // description was used to hold content of "welcome page"
  // "welcome page" will be a customizable question in scheme
  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public description!: string | null;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public feedbackEnabled!: boolean;

  @Column({
    allowNull: false,
    defaultValue: 'default',
    type: DataType.STRING(50),
  })
  public feedbackStyle!: string;

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
    defaultValue: 1,
  })
  public numberOfSubmissionsForFeedback!: number;

  // V4 Deprecated
  // finalPageHtml was used to hold content of "final page"
  // "final page" will be a customizable question in scheme
  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public finalPageHtml!: string | null;

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
  get overrides(): SchemeOverrides {
    const val = this.getDataValue('overrides') as unknown;
    return val ? JSON.parse(val as string) : defaultOverrides;
  }

  set overrides(value: SchemeOverrides) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('overrides', JSON.stringify(value ?? defaultOverrides));
  }

  @HasMany(() => ClientErrorReport, 'surveyId')
  public clientErrors?: ClientErrorReport[];

  @HasOne(() => GenUserCounter, 'surveyId')
  public counter?: GenUserCounter;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @BelongsTo(() => Scheme, 'schemeId')
  public scheme?: Scheme;

  @HasMany(() => UserSurveyAlias, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
    foreignKey: 'surveyId',
  })
  public respondents?: UserSurveyAlias[];

  @HasMany(() => UserSession, 'surveyId')
  public sessions?: UserSession[];

  @HasMany(() => SurveySubmission, 'surveyId')
  public submissions?: SurveySubmission[];

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

  // TODO: add BulkAfterCreate & BulkAfterDestroy when implemented in system
}
