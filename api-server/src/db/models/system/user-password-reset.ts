import { BelongsTo, Column, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserPasswordReset',
  tableName: 'user_password_resets',
  freezeTableName: true,
  underscored: true,
})
export default class UserPasswordReset extends BaseModel<UserPasswordReset> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public userId!: number;

  @Column
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
