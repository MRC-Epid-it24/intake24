import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import {
  SurveySubmissionFoodCustomFieldAttributes,
  SurveySubmissionFoodCustomFieldCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';
import { SurveySubmissionFood } from '.';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
}))
@Table({
  modelName: 'SurveySubmissionFoodCustomField',
  tableName: 'survey_submission_food_custom_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionFoodCustomField
  extends BaseModel<
    SurveySubmissionFoodCustomFieldAttributes,
    SurveySubmissionFoodCustomFieldCreationAttributes
  >
  implements SurveySubmissionFoodCustomFieldAttributes
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
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
