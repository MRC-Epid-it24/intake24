import { Column, DataType, ForeignKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import { Permission, Role } from '.';

@Table({
  modelName: 'PermissionRole',
  tableName: 'permission_role',
  freezeTableName: true,
  underscored: true,
})
export default class PermissionUser extends BaseModel {
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.BIGINT,
  })
  public permissionId!: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
  })
  public roleId!: number;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
