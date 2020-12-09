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
import { surveyPermissions } from '@api-server/services/acl.service';
import { Survey as SurveyAttributes, SurveyState } from '@common/types/models/system';
import BaseModel from '../model';
import { GenUserCounter, Locale, Permission, Scheme, SurveySubmission, UserSurveyAlias } from '.';

@Scopes(() => ({
  public: {
    attributes: ['id', 'localeId', 'originatingUrl', 'supportEmail'],
  },
  respondent: {
    attributes: [
      'id',
      'localeId',
      'numberOfSubmissionsForFeedback',
      'schemeId',
      'state',
      'storeUserSessionOnServer',
      'suspensionReason',
    ],
  },
  counter: { include: [{ model: GenUserCounter }] },
  locale: { include: [{ model: Locale }] },
  scheme: { include: [{ model: Scheme }] },
  respondents: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
}))
@Table({
  modelName: 'Survey',
  tableName: 'surveys',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Survey extends BaseModel<Survey> implements SurveyAttributes {
  @Column({
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
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
  })
  public schemeId!: string;

  @Column({
    allowNull: false,
  })
  public localeId!: string;

  @Column({
    allowNull: false,
  })
  public allowGenUsers!: boolean;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public genUserKey!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public authUrlDomainOverride!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public suspensionReason!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public surveyMonkeyUrl!: string | null;

  @Column({
    allowNull: false,
  })
  public supportEmail!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public originatingUrl!: string | null;

  // V4 Deprecated
  // description was used to hold content of "welcome page"
  // "welcome page" will be a customizable question in scheme
  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public description!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public feedbackEnabled!: boolean;

  @Column({
    allowNull: false,
    defaultValue: 'default',
  })
  public feedbackStyle!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public submissionNotificationUrl!: string | null;

  @Column
  public storeUserSessionOnServer!: boolean;

  @Column({
    allowNull: false,
    defaultValue: 1,
  })
  public numberOfSubmissionsForFeedback!: number;

  // V4 Deprecated
  // finalPageHtml was used to hold content of "final page"
  // "final page" will be a customizable question in scheme
  @Column
  public finalPageHtml!: string;

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

  @HasOne(() => GenUserCounter, 'surveyId')
  public counter?: GenUserCounter;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @BelongsTo(() => Scheme, 'schemeId')
  public scheme?: Scheme;

  @HasMany(() => UserSurveyAlias, 'surveyId')
  public respondents?: UserSurveyAlias[];

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
