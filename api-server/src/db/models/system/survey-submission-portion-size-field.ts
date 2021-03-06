import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionPortionSizeField as SurveySubmissionPortionSizeFieldAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmissionFood } from '.';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
}))
@Table({
  modelName: 'SurveySubmissionPortionSizeField',
  tableName: 'survey_submission_portion_size_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionPortionSizeField
  extends BaseModel
  implements SurveySubmissionPortionSizeFieldAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public foodId!: number;

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

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
