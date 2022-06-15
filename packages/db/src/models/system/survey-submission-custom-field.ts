import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import type {
  SurveySubmissionCustomFieldAttributes,
  SurveySubmissionCustomFieldCreationAttributes,
} from '@intake24/common/types/models';
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
  extends BaseModel<
    SurveySubmissionCustomFieldAttributes,
    SurveySubmissionCustomFieldCreationAttributes
  >
  implements SurveySubmissionCustomFieldAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public surveySubmissionId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => SurveySubmission, 'surveySubmissionId')
  public submission?: SurveySubmission;
}
