import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import {
  SurveySubmissionFoodAttributes,
  SurveySubmissionFoodCreationAttributes,
} from '@common/types/models';
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
  extends BaseModel<SurveySubmissionFoodAttributes, SurveySubmissionFoodCreationAttributes>
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
    type: DataType.STRING(8),
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public englishDescription!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(128),
  })
  public localDescription!: string | null;

  @Column({
    allowNull: false,
  })
  public readyMeal!: boolean;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public searchTerm!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
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
    type: DataType.STRING(256),
  })
  public foodGroupEnglishDescription!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  public foodGroupLocalDescription!: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public brand!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
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
