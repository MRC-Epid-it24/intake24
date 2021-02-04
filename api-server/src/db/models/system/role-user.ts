import { Column, DataType, ForeignKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import { Role, User } from '.';

@Table({
  modelName: 'RoleUser',
  tableName: 'role_user',
  freezeTableName: true,
  underscored: true,
})
export default class RoleUser extends BaseModel {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
  })
  public roleId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  public userId!: number;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
