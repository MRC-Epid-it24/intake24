import { BelongsTo, Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Locale from './locale';
import Scheme from './scheme';
import SurveySubmission from './survey-submission';
import UserSurveyAlias from './user-survey-alias';

export enum SurveyState {
  NOT_STARTED = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
}

@Scopes(() => ({
  public: {
    attributes: ['id', 'locale', 'originatingUrl', 'supportEmail'],
  },
  respodent: {
    attributes: [
      'id',
      'locale',
      'description',
      'finalPageHtml',
      'numberOfSubmissionsForFeedback',
      'schemeId',
      'state',
      'storeUserSessionOnServer',
      'suspensionReason',
    ],
  },
  localeModel: { include: [{ model: Locale }] },
  scheme: { include: [{ model: Scheme }] },
  respodents: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class Survey extends BaseModel<Survey> {
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
  public locale!: string;

  @Column({
    allowNull: false,
  })
  public allowGenUsers!: boolean;

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

  @BelongsTo(() => Locale, 'locale')
  public localeModel?: Locale;

  @BelongsTo(() => Scheme, 'schemeId')
  public scheme?: Scheme;

  @HasMany(() => UserSurveyAlias, 'surveyId')
  public respodents?: UserSurveyAlias[];

  @HasMany(() => SurveySubmission, 'surveyId')
  public submissions?: SurveySubmission[];
}
