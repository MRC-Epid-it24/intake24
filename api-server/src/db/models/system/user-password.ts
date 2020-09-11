import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import User from './user';

@Table({
  modelName: 'UserPassword',
  tableName: 'user_passwords',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserPassword extends BaseModel<UserPassword> {
  @Column({
    primaryKey: true,
  })
  @ForeignKey(() => User)
  public userId!: number;

  @Column({
    allowNull: false,
  })
  public passwordHash!: string;

  @Column({
    allowNull: false,
  })
  public passwordSalt!: string;

  @Column({
    allowNull: false,
  })
  public passwordHasher!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
