import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import {
  SurveySubmissionNutrientAttributes,
  SurveySubmissionNutrientCreationAttributes,
} from '@common/types/models';
import { NutrientType, SurveySubmissionFood } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
  nutrientType: { include: [{ model: NutrientType }] },
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

  @BelongsTo(() => NutrientType, 'nutrientTypeId')
  public nutrientType?: NutrientType;
}
