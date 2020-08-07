import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import Permission from './permission';
import Role from './role';

@Table({
  modelName: 'PermissionRole',
  tableName: 'permission_role',
  freezeTableName: true,
  underscored: true,
})
export default class PermissionRole extends Model<PermissionRole> {
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
