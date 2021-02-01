import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
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
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
