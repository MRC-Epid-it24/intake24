import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
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
export default class SurveySubmissionMissingFood extends BaseModel<SurveySubmissionMissingFood> {
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
  public name!: string;

  @Column({
    allowNull: false,
  })
  public brand!: string;

  @Column
  public description!: string;

  @Column({
    allowNull: false,
  })
  public portionSize!: string;

  @Column({
    allowNull: false,
  })
  public leftovers!: string;

  @BelongsTo(() => SurveySubmissionMeal, 'mealId')
  public meal?: SurveySubmissionMeal;
}
