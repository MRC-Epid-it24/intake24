import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionFoodField as SurveySubmissionFoodFieldAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmissionFood } from '.';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
}))
@Table({
  modelName: 'SurveySubmissionFoodField',
  // TODO: rename to follow naming convention? -> survey_submission_food_field
  tableName: 'survey_submission_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionFoodField
  extends BaseModel<SurveySubmissionFoodField>
  implements SurveySubmissionFoodFieldAttributes {
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
  public fieldName!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
