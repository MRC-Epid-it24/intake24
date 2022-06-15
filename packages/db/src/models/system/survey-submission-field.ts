import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import type {
  SurveySubmissionFieldAttributes,
  SurveySubmissionFieldCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { SurveySubmissionFood } from '.';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
}))
@Table({
  modelName: 'SurveySubmissionField',
  tableName: 'survey_submission_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionField
  extends BaseModel<SurveySubmissionFieldAttributes, SurveySubmissionFieldCreationAttributes>
  implements SurveySubmissionFieldAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public fieldName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
