import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import SurveySubmissionFood from './survey-submission-food';

@Scopes(() => ({
  food: { include: [{ model: SurveySubmissionFood }] },
}))
@Table({
  modelName: 'SurveySubmissionNutrient',
  tableName: 'survey_submission_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionNutrient extends BaseModel<SurveySubmissionNutrient> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public foodId!: number;

  @Column({
    allowNull: false,
  })
  public amount!: number;

  @Column({
    allowNull: false,
  })
  public nutrientTypeId!: number;

  @BelongsTo(() => SurveySubmissionFood, 'foodId')
  public food?: SurveySubmissionFood;
}
