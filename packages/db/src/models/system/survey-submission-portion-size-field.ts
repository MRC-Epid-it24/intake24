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
export default class SurveySubmissionPortionSizeField extends BaseModel<
  InferAttributes<SurveySubmissionPortionSizeField>,
  InferCreationAttributes<SurveySubmissionPortionSizeField>
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

export type SurveySubmissionPortionSizeFieldAttributes =
  Attributes<SurveySubmissionPortionSizeField>;
export type SurveySubmissionPortionSizeFieldCreationAttributes =
  CreationAttributes<SurveySubmissionPortionSizeField>;
