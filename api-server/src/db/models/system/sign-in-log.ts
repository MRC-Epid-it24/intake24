import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SignInLog as SignInLogAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

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
export default class SignInLog extends BaseModel implements SignInLogAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    defaultValue: () => new Date(),
  })
  public date!: Date;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public remoteAddress!: string | null;

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

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public userId!: number | null;

  @Column({
    type: DataType.TEXT,
  })
  public message!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public userAgent!: string | null;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
