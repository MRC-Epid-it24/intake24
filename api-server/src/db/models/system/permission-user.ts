import { Column, DataType, ForeignKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { PermissionUserAttributes, PermissionUserCreationAttributes } from '@common/types/models';
import BaseModel from '@/db/models/model';
import { Permission, User } from '.';

@Table({
  modelName: 'PermissionUser',
  tableName: 'permission_user',
  freezeTableName: true,
  underscored: true,
})
export default class PermissionUser
  extends BaseModel<PermissionUserAttributes, PermissionUserCreationAttributes>
  implements PermissionUserAttributes
{
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.BIGINT,
  })
  public permissionId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  public userId!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
