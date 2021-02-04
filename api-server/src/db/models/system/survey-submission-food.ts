import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { SurveySubmissionFood as SurveySubmissionFoodAttributes } from '@common/types/models';
import BaseModel from '../model';
import {
  SurveySubmissionField,
  SurveySubmissionFoodCustomField,
  SurveySubmissionMeal,
  SurveySubmissionNutrient,
  SurveySubmissionPortionSizeField,
} from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
  customFields: { include: [{ model: SurveySubmissionFoodCustomField }] },
  fields: { include: [{ model: SurveySubmissionField }] },
  nutrients: { include: [{ model: SurveySubmissionNutrient }] },
  portionSizes: { include: [{ model: SurveySubmissionPortionSizeField }] },
}))
@Table({
  modelName: 'SurveySubmissionFood',
  tableName: 'survey_submission_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionFood
  extends BaseModel
  implements SurveySubmissionFoodAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public mealId!: number;

  @Column({
    allowNull: false,
  })
  public code!: string;

  @Column({
    allowNull: false,
  })
  public englishDescription!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public localDescription!: string | null;

  @Column({
    allowNull: false,
  })
  public readyMeal!: boolean;

  @Column({
    allowNull: false,
  })
  public searchTerm!: string;

  @Column({
    allowNull: false,
  })
  public portionSizeMethodId!: string;

  @Column({
    allowNull: false,
  })
  public reasonableAmount!: boolean;

  @Column({
    allowNull: false,
  })
  public foodGroupId!: number;

  @Column({
    allowNull: false,
  })
  public foodGroupEnglishDescription!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public foodGroupLocalDescription!: string | null;

  @Column({
    allowNull: false,
  })
  public brand!: string;

  @Column({
    allowNull: false,
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
  })
  public nutrientTableCode!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;

  @HasMany(() => SurveySubmissionFoodCustomField, 'foodId')
  public customFields?: SurveySubmissionFoodCustomField[];

  @HasMany(() => SurveySubmissionField, 'foodId')
  public fields?: SurveySubmissionField[];

  @HasMany(() => SurveySubmissionNutrient, 'foodId')
  public nutrients?: SurveySubmissionNutrient[];

  @HasMany(() => SurveySubmissionPortionSizeField, 'foodId')
  public portionSizes?: SurveySubmissionPortionSizeField[];
}
