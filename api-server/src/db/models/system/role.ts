import {
  BelongsToMany,
  Column,
  DataType,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import { Role as RoleAttributes } from '@common/types/models/system';
import Permission from './permission';
import PermissionRole from './permission-role';
import RoleUser from './role-user';
import User from './user';

@Scopes(() => ({
  list: { attributes: ['id', 'name', 'displayName'] },
  permissions: { include: [{ model: Permission, through: { attributes: [] } }] },
  users: { include: [{ model: User, through: { attributes: [] } }] },
}))
@Table({
  modelName: 'Role',
  tableName: 'roles',
  freezeTableName: true,
  underscored: true,
})
export default class Role extends BaseModel<Role> implements RoleAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    unique: true,
  })
  public name!: string;

  @Column
  public displayName!: string;

  @Column
  public description!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsToMany(() => User, () => RoleUser)
  public users?: User[];

  @BelongsToMany(() => Permission, () => PermissionRole)
  public permissions?: Permission[];
}
