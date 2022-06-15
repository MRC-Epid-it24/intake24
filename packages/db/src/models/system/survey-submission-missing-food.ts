import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import type {
  SurveySubmissionMissingFoodAttributes,
  SurveySubmissionMissingFoodCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { SurveySubmissionMeal } from '.';

@Scopes(() => ({
  meal: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmissionMissingFood',
  tableName: 'survey_submission_missing_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionMissingFood
  extends BaseModel<
    SurveySubmissionMissingFoodAttributes,
    SurveySubmissionMissingFoodCreationAttributes
  >
  implements SurveySubmissionMissingFoodAttributes
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
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public brand!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public portionSize!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public leftovers!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;
}
