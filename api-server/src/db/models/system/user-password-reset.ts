import { BelongsTo, Column, DataType, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import {
  UserPasswordResetAttributes,
  UserPasswordResetCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserPasswordReset',
  tableName: 'user_password_resets',
  freezeTableName: true,
  underscored: true,
})
export default class UserPasswordReset
  extends BaseModel<UserPasswordResetAttributes, UserPasswordResetCreationAttributes>
  implements UserPasswordResetAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public token!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
