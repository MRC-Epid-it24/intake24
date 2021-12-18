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
  implements SurveySubmissionFoodAttributes
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
  public mealId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public englishName!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  public localName!: string | null;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
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
    type: DataType.BOOLEAN,
  })
  public reasonableAmount!: boolean;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodGroupId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public foodGroupEnglishName!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  public foodGroupLocalName!: string | null;

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
