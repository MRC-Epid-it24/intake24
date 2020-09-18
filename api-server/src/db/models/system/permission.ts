import {
  AfterCreate,
  AfterBulkCreate,
  BelongsToMany,
  Column,
  DataType,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import config from '@/config/acl';
import PermissionRole from './permission-role';
import PermissionUser from './permission-user';
import Role from './role';
import User from './user';

export const addPermissionsToAdmin = async (permissions: Permission[]): Promise<void> => {
  const admin = await Role.findOne({ where: { name: config.roles.superuser } });
  if (admin) await admin.$add('permissions', permissions);
};

@Scopes(() => ({
  list: { attributes: ['id', 'name', 'displayName'] },
  roles: { include: [{ model: Role, through: { attributes: [] } }] },
  rolesUsers: { include: [{ model: Role, include: [{ model: User }] }] },
  users: { include: [{ model: User, through: { attributes: [] } }] },
}))
@Table({
  modelName: 'Permission',
  tableName: 'permissions',
  freezeTableName: true,
  underscored: true,
})
export default class Permission extends BaseModel<Permission> {
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

  @BelongsToMany(() => Role, () => PermissionRole)
  public roles?: Role[];

  @BelongsToMany(() => User, () => PermissionUser)
  public users?: User[];

  // Always attach new permission(s) to main admin/superuser role
  @AfterCreate
  static async handleAdminPermission(permission: Permission): Promise<void> {
    await addPermissionsToAdmin([permission]);
  }

  @AfterBulkCreate
  static async handleAdminPermissions(permissions: Permission[]): Promise<void> {
    await addPermissionsToAdmin(permissions);
  }
}
