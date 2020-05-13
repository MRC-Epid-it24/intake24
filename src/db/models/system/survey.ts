import { Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import UserSurveyAlias from './user-survey-alias';

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
  respodents: { include: [{ model: UserSurveyAlias }] },
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
  public state!: number;

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

  @Column
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
  })
  public numberOfSubmissionsForFeedback!: number;

  @Column
  public finalPageHtml!: string;

  @HasMany(() => UserSurveyAlias, 'surveyId')
  public respodents?: UserSurveyAlias[];
}
