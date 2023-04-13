import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { SurveySubmissionMeal } from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmissionMealCustomField',
  tableName: 'survey_submission_meal_custom_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMealCustomField extends BaseModel<
  InferAttributes<SurveySubmissionMealCustomField>,
  InferCreationAttributes<SurveySubmissionMealCustomField>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare mealId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare value: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  declare meal?: NonAttribute<SurveySubmissionMeal>;
}

export type SurveySubmissionMealCustomFieldAttributes = Attributes<SurveySubmissionMealCustomField>;
export type SurveySubmissionMealCustomFieldCreationAttributes =
  CreationAttributes<SurveySubmissionMealCustomField>;
