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
  ForeignKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Survey, SurveySubmission, User } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserSurveyRating',
  tableName: 'user_survey_ratings',
  freezeTableName: true,
  underscored: true,
})
export default class UserSurveyRating extends BaseModel<
  InferAttributes<UserSurveyRating>,
  InferCreationAttributes<UserSurveyRating>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  declare userId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Survey)
  declare surveyId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare type: 'recall' | 'feedback';

  @Column({
    allowNull: true,
    type: DataType.UUID,
    unique: 'user_survey_rating',
  })
  @ForeignKey(() => SurveySubmission)
  declare submissionId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.SMALLINT,
  })
  declare rating: number;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  declare comment: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>;

  @BelongsTo(() => Survey, 'surveyId')
  declare survey?: NonAttribute<Survey>;

  @BelongsTo(() => SurveySubmission, 'submissionId')
  declare submission?: NonAttribute<SurveySubmission>;
}

export type UserSurveyRatingAttributes = Attributes<UserSurveyRating>;
export type UserSurveyRatingCreationAttributes = CreationAttributes<UserSurveyRating>;
