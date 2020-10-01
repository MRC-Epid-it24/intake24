import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Permission, User } from '.';

@Table({
  modelName: 'PermissionUser',
  tableName: 'permission_user',
  freezeTableName: true,
  underscored: true,
})
export default class PermissionUser extends Model<PermissionUser> {
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.BIGINT,
  })
  public permissionId!: number;

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
