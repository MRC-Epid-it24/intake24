import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmission as SurveySubmissionAttributes } from '@common/types/models';
import BaseModel from '../model';
import { Survey, SurveySubmissionCustomField, SurveySubmissionMeal, User } from '.';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
  customFields: { include: [{ model: SurveySubmissionCustomField }] },
  meals: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmission',
  tableName: 'survey_submissions',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmission extends BaseModel implements SurveySubmissionAttributes {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
  })
  public userId!: number;

  @Column({
    allowNull: false,
  })
  public startTime!: Date;

  @Column({
    allowNull: false,
  })
  public endTime!: Date;

  @Column({
    allowNull: false,
  })
  public submissionTime!: Date;

  @Column({
    allowNull: true,
    type: DataType.ARRAY(DataType.TEXT),
  })
  public log!: string[] | null;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public uxSessionId!: string;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @HasMany(() => SurveySubmissionCustomField, 'surveySubmissionId')
  public customFields?: SurveySubmissionCustomField[];

  @HasMany(() => SurveySubmissionMeal, 'surveySubmissionId')
  public meals?: SurveySubmissionMeal[];
}
