import { BelongsTo, Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { SurveyState } from '@intake24/common/types';
import type {
  UserSurveySessionAttributes,
  UserSurveySessionCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { Survey, User } from '.';

@Table({
  modelName: 'UserSurveySession',
  tableName: 'user_survey_sessions',
  freezeTableName: true,
  underscored: true,
})
export default class UserSurveySession
  extends BaseModel<UserSurveySessionAttributes, UserSurveySessionCreationAttributes>
  implements UserSurveySessionAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public userId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public surveyId!: string;

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
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
