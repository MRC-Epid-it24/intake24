import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

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
export default class SurveySubmissionFoodCustomField extends BaseModel<
  InferAttributes<SurveySubmissionFoodCustomField>,
  InferCreationAttributes<SurveySubmissionFoodCustomField>
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare foodId: string;

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

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  declare food?: NonAttribute<SurveySubmissionFood>;
}

export type SurveySubmissionFoodCustomFieldAttributes = Attributes<SurveySubmissionFoodCustomField>;
export type SurveySubmissionFoodCustomFieldCreationAttributes =
  CreationAttributes<SurveySubmissionFoodCustomField>;
