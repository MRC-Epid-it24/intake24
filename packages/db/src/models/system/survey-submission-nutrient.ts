import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import type {
  SurveySubmissionNutrientAttributes,
  SurveySubmissionNutrientCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { SurveySubmissionFood, SystemNutrientType } from '.';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
  nutrientType: { include: [{ model: SystemNutrientType }] },
}))
@Table({
  modelName: 'SurveySubmissionNutrient',
  tableName: 'survey_submission_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionNutrient
  extends BaseModel<SurveySubmissionNutrientAttributes, SurveySubmissionNutrientCreationAttributes>
  implements SurveySubmissionNutrientAttributes
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
    type: DataType.DOUBLE,
  })
  public amount!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;

  @BelongsTo(() => SystemNutrientType, 'nutrientTypeId')
  public nutrientType?: SystemNutrientType;
}
