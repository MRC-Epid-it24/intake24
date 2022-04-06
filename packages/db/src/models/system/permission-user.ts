import { Column, DataType, ForeignKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import {
  PermissionUserAttributes,
  PermissionUserCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
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
    allowNull: true,
    type: DataType.BIGINT,
  })
  public permissionId!: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
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
