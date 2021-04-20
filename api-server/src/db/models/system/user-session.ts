import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import { UserSession as UserSessionAttributes } from '@common/types/models';
import { Survey, User } from '.';

@Table({
  modelName: 'UserSession',
  tableName: 'user_sessions',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserSession extends BaseModel implements UserSessionAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  // TODO: add types for recall state
  get sessionData(): any {
    const val = this.getDataValue('sessionData') as unknown;
    return JSON.parse(val as string);
  }

  set sessionData(value: any) {
    this.setDataValue('sessionData', JSON.stringify(value));
  }

  @Column({
    allowNull: false,
  })
  public readonly created!: Date;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
