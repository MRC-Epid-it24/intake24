import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import type {
  SignInLogAttributes,
  SignInLogCreationAttributes,
} from '@intake24/common/types/models';
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
export default class SignInLog
  extends BaseModel<SignInLogAttributes, SignInLogCreationAttributes>
  implements SignInLogAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public userId!: string | null;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: () => new Date(),
  })
  public date!: Date;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public remoteAddress!: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public provider!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public providerKey!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public successful!: boolean;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public message!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public userAgent!: string | null;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
