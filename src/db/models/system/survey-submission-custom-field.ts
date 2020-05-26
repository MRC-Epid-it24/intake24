import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import SurveySubmission from './survey-submission';

@Scopes(() => ({
  submission: { include: [{ model: SurveySubmission }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionCustomField extends BaseModel<SurveySubmissionCustomField> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public surveySubmissionId!: string;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => SurveySubmission, 'surveySubmissionId')
  public submission?: SurveySubmission;
}
