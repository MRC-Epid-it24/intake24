import { BelongsTo, Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type {
  UserPasswordResetAttributes,
  UserPasswordResetCreationAttributes,
} from '@intake24/common/types/models';

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
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: string;

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
