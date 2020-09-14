import { uniqBy } from 'lodash';
import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  HasMany,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import BaseModel from '../model';
import {
  Permission,
  PermissionUser,
  Role,
  RoleUser,
  SigninLog,
  SurveySubmission,
  UserPassword,
  UserPasswordReset,
  UserSurveyAlias,
} from '.';

@Scopes(() => ({
  password: { include: [{ model: UserPassword }] },
  passwordResets: { include: [{ model: UserPasswordReset }] },
  permissions: { include: [{ model: Permission, through: { attributes: [] } }] },
  roles: { include: [{ model: Role, through: { attributes: [] } }] },
  rolesPerms: {
    include: [
      {
        model: Role,
        through: { attributes: [] },
        include: [{ model: Permission, through: { attributes: [] } }],
      },
    ],
  },
  signinLog: { include: [{ model: SigninLog }] },
  aliases: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
}))
@Table({
  modelName: 'User',
  tableName: 'users',
  freezeTableName: true,
  underscored: true,
})
export default class User extends BaseModel<User> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column
  public name!: string;

  @Column
  public email!: string;

  @Column
  public phone!: string;

  @Column
  public simpleName!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public multiFactorAuthentication!: boolean;

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  public emailNotifications!: boolean;

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  public smsNotifications!: boolean;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasOne(() => UserPassword, 'userId')
  public password?: UserPassword;

  @HasMany(() => UserPasswordReset, 'userId')
  public passwordResets?: UserPasswordReset[];

  @BelongsToMany(() => Permission, () => PermissionUser)
  public permissions?: Permission[];

  @BelongsToMany(() => Role, () => RoleUser)
  public roles?: Role[];

  @HasMany(() => SigninLog, 'userId')
  public signinLog?: SigninLog[];

  @HasMany(() => UserSurveyAlias, 'userId')
  public aliases?: UserSurveyAlias[];

  @HasMany(() => SurveySubmission, 'userId')
  public submissions?: SurveySubmission[];

  public allRoles(): Role[] {
    return uniqBy(this.roles, 'name');
  }

  public hasRoleByName(role: string): boolean {
    if (!this.roles) return false;

    const match = this.roles.find((item) => item.name === role);
    return !!match;
  }

  public hasAnyRole(roles: string[]): boolean {
    if (!this.roles) return false;

    return this.roles.some((item) => roles.includes(item.name));
  }

  public allPermissions(): Permission[] {
    const permissions = this.permissions ?? [];

    const rolePermissions = this.roles
      ? this.roles.reduce((acc, item) => {
          return item.permissions ? acc.concat(item.permissions) : acc;
        }, [] as Permission[])
      : [];

    return uniqBy(permissions.concat(rolePermissions), 'name');
  }

  public hasPermissionByName(permission: string): boolean {
    const permissions = this.allPermissions();

    const match = permissions.find((item) => item.name === permission);
    return !!match;
  }

  public can(permission: string): boolean {
    return this.hasPermissionByName(permission);
  }

  public hasAnyPermission(permission: string[]): boolean {
    const permissions = this.allPermissions();

    return permissions.some((item) => permission.includes(item.name));
  }
}
