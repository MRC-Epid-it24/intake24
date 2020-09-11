import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import User from './user';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'SigninLog',
  tableName: 'signin_log',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SigninLog extends BaseModel<SigninLog> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    defaultValue: new Date(),
  })
  public date!: Date;

  @Column
  public remoteAddress!: string;

  @Column({
    allowNull: false,
  })
  public provider!: string;

  @Column({
    allowNull: false,
  })
  public providerKey!: string;

  @Column({
    allowNull: false,
  })
  public successful!: boolean;

  @Column
  public userId!: number;

  @Column({
    type: DataType.TEXT,
  })
  public message!: boolean;

  @Column
  public userAgent!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
