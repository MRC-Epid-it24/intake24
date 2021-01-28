import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
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
export default class UserPassword
  extends BaseModel<UserPassword>
  implements UserPasswordAttributes {
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
