import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
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
export default class SurveySubmission extends BaseModel<
  InferAttributes<SurveySubmission>,
  InferCreationAttributes<SurveySubmission>
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare surveyId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare userId: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare startTime: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare endTime: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare submissionTime: Date;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare log: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare uxSessionId: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare userAgent: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Survey, 'surveyId')
  declare survey?: NonAttribute<Survey>;

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>;

  @HasMany(() => SurveySubmissionCustomField, 'surveySubmissionId')
  declare customFields?: NonAttribute<SurveySubmissionCustomField[]>;

  @HasMany(() => SurveySubmissionMeal, 'surveySubmissionId')
  declare meals?: NonAttribute<SurveySubmissionMeal[]>;
}

export type SurveySubmissionAttributes = Attributes<SurveySubmission>;
export type SurveySubmissionCreationAttributes = CreationAttributes<SurveySubmission>;
