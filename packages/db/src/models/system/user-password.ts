import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import type { UserPasswordAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserPassword',
  tableName: 'user_passwords',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserPassword
  extends BaseModel<UserPasswordAttributes>
  implements UserPasswordAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

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
