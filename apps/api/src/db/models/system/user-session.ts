import { BelongsTo, Column, DataType, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { UserSessionAttributes, UserSessionCreationAttributes } from '@common/types/models';
import { SurveyState } from '@common/types';
import BaseModel from '@api/db/models/model';
import { Survey, User } from '.';

@Table({
  modelName: 'UserSession',
  tableName: 'user_sessions',
  freezeTableName: true,
  underscored: true,
})
export default class UserSession
  extends BaseModel<UserSessionAttributes, UserSessionCreationAttributes>
  implements UserSessionAttributes
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
    type: DataType.STRING(64),
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
