import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  AfterBulkCreate,
  AfterCreate,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { aclConfig } from '@intake24/common-backend';

import BaseModel from '../model';
import { PermissionRole, PermissionUser, Role, User } from '.';

export async function addPermissionsToAdmin(permissions: Permission[]): Promise<void> {
  const admin = await Role.findOne({ where: { name: aclConfig.roles.superuser } });
  if (admin)
    await admin.$add('permissions', permissions);
}

@Scopes(() => ({
  list: { attributes: ['id', 'name', 'displayName'], order: [['name', 'ASC']] },
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
export default class Permission extends BaseModel<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(128),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare displayName: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare description: CreationOptional<string | null>;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  @BelongsToMany(() => Role, () => PermissionRole)
  declare roles?: NonAttribute<Role[]>;

  @HasMany(() => PermissionRole, 'permissionId')
  declare roleLinks?: NonAttribute<PermissionRole[]>;

  @BelongsToMany(() => User, () => PermissionUser)
  declare users?: NonAttribute<User[]>;

  @HasMany(() => PermissionUser, 'permissionId')
  declare userLinks?: NonAttribute<PermissionUser[]>;

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

export type PermissionAttributes = Attributes<Permission>;
export type PermissionCreationAttributes = CreationAttributes<Permission>;
