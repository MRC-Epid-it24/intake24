import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
})
export default class UserRole extends BaseModel<UserRole> {
  @Column({
    primaryKey: true,
  })
  @ForeignKey(() => User)
  public userId!: number;

  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public role!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
