import {
  AfterCreate,
  AfterDestroy,
  BelongsTo,
  Column,
  HasOne,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { surveyPermissions } from '@/services/acl.service';
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
      'description',
      'finalPageHtml',
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

  @Column
  public genUserKey!: string;

  @Column
  public suspensionReason!: string;

  @Column
  public surveyMonkeyUrl!: string;

  @Column({
    allowNull: false,
  })
  public supportEmail!: string;

  @Column
  public originatingUrl!: string;

  @Column
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

  @Column
  public submissionNotificationUrl!: string;

  @Column
  public storeUserSessionOnServer!: boolean;

  @Column({
    allowNull: false,
    defaultValue: 1,
  })
  public numberOfSubmissionsForFeedback!: number;

  @Column
  public finalPageHtml!: string;

  @Column({
    allowNull: false,
    defaultValue: 3,
  })
  public maximumDailySubmissions!: number;

  @Column
  public maximumTotalSubmissions!: number;

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
