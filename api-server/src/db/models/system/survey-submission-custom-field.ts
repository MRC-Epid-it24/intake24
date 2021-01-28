import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionCustomField as SurveySubmissionCustomFieldAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmission } from '.';

@Scopes(() => ({
  submission: { include: [{ model: SurveySubmission }] },
}))
@Table({
  modelName: 'SurveySubmissionCustomField',
  tableName: 'survey_submission_custom_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionCustomField
  extends BaseModel<SurveySubmissionCustomField>
  implements SurveySubmissionCustomFieldAttributes {
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
