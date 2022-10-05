import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type {
  SurveySubmissionAttributes,
  SurveySubmissionCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { Survey, SurveySubmissionCustomField, SurveySubmissionMeal, User } from '.';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
  customFields: { include: [{ model: SurveySubmissionCustomField }] },
  meals: { include: [{ model: SurveySubmissionMeal }] },
}))
@Table({
  modelName: 'SurveySubmission',
  tableName: 'survey_submissions',
  freezeTableName: true,
  underscored: true,
})
export default class SurveySubmission
  extends BaseModel<SurveySubmissionAttributes, SurveySubmissionCreationAttributes>
  implements SurveySubmissionAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public startTime!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public endTime!: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  public submissionTime!: Date;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public log!: string | null;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public uxSessionId!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public userAgent!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @HasMany(() => SurveySubmissionCustomField, 'surveySubmissionId')
  public customFields?: SurveySubmissionCustomField[];

  @HasMany(() => SurveySubmissionMeal, 'surveySubmissionId')
  public meals?: SurveySubmissionMeal[];
}
