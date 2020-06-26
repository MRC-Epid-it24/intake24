import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';
import SurveySubmissionCustomField from './survey-submission-custom-field';
import SurveySubmissionMeal from './survey-submission-meal';
import User from './user';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
  customFields: { include: [{ model: SurveySubmissionCustomField }] },
  meals: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class SurveySubmission extends BaseModel<SurveySubmission> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column({
    allowNull: false,
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

  @Column
  public log!: string;

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
