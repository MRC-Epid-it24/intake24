import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { UserPassword as UserPasswordAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserPassword',
  tableName: 'user_passwords',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserPassword extends BaseModel implements UserPasswordAttributes {
  @Column({
    primaryKey: true,
  })
  @ForeignKey(() => User)
  public userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public passwordHash!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public passwordSalt!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public passwordHasher!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
