import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { SurveyState } from '@intake24/common/types';

import BaseModel from '../model';
import { Survey, User } from '.';

@Table({
  modelName: 'UserSurveySession',
  tableName: 'user_survey_sessions',
  freezeTableName: true,
  underscored: true,
})
export default class UserSurveySession extends BaseModel<
  InferAttributes<UserSurveySession>,
  InferCreationAttributes<UserSurveySession>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare userId: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare surveyId: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get sessionData(): SurveyState {
    const val = this.getDataValue('sessionData') as unknown;
    return JSON.parse(val as string);
  }

  set sessionData(value: SurveyState) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('sessionData', JSON.stringify(value));
  }

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Survey, 'surveyId')
  declare survey?: NonAttribute<Survey>;

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>;
}

export type UserSurveySessionAttributes = Attributes<UserSurveySession>;
export type UserSurveySessionCreationAttributes = CreationAttributes<UserSurveySession>;
