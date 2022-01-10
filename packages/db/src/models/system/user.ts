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
import { UserAttributes, UserCreationAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import {
  ClientErrorReport,
  Job,
  Permission,
  PermissionUser,
  RefreshToken,
  Role,
  RoleUser,
  SignInLog,
  SurveySubmission,
  UserCustomField,
  UserPassword,
  UserPasswordReset,
  UserPhysicalData,
  UserSession,
  UserSubscription,
  UserSurveyAlias,
} from '.';

@Scopes(() => ({
  aliases: { include: [{ model: UserSurveyAlias, separate: true }] },
  clientErrors: { include: [{ model: ClientErrorReport, separate: true }] },
  customFields: { include: [{ model: UserCustomField, separate: true }] },
  jobs: { include: [{ model: Job }] },
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
  signInLog: { include: [{ model: SignInLog }] },
  submissions: { include: [{ model: SurveySubmission }] },
  tokens: { include: [{ model: RefreshToken }] },
}))
@Table({
  modelName: 'User',
  tableName: 'users',
  freezeTableName: true,
  underscored: true,
})
export default class User
  extends BaseModel<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public name!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public email!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(32),
  })
  public phone!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public simpleName!: string | null;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  public multiFactorAuthentication!: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  public emailNotifications!: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  public smsNotifications!: boolean;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => UserSurveyAlias, 'userId')
  public aliases?: UserSurveyAlias[];

  @HasMany(() => ClientErrorReport, 'userId')
  public clientErrors?: ClientErrorReport[];

  @HasMany(() => UserCustomField, 'userId')
  public customFields?: UserCustomField[];

  @HasMany(() => Job, 'userId')
  public jobs?: Job[];

  @HasOne(() => UserPassword, 'userId')
  public password?: UserPassword;

  @HasMany(() => UserPasswordReset, 'userId')
  public passwordResets?: UserPasswordReset[];

  @BelongsToMany(() => Permission, () => PermissionUser)
  public permissions?: Permission[];

  @HasOne(() => UserPhysicalData)
  public physicalData?: UserPhysicalData;

  @BelongsToMany(() => Role, () => RoleUser)
  public roles?: Role[];

  @HasMany(() => UserSession, 'userId')
  public sessions?: UserSession[];

  @HasMany(() => SignInLog, 'userId')
  public signInLog?: SignInLog[];

  @HasMany(() => SurveySubmission, 'userId')
  public submissions?: SurveySubmission[];

  @HasMany(() => UserSubscription, 'userId')
  public subscription?: UserSubscription[];

  @HasMany(() => RefreshToken, 'userId')
  public tokens?: RefreshToken[];

  public allRoles(): Role[] {
    return uniqBy(this.roles, 'name');
  }

  public hasRole(role: string | string[], key: 'id' | 'name' = 'name'): boolean {
    if (!this.roles || !this.roles.length) return false;

    if (Array.isArray(role)) {
      const currentRoleKeys = this.roles.map((item) => item[key]);
      return role.every((item) => currentRoleKeys.includes(item));
    }

    return !!this.roles.find((item) => item[key] === role);
  }

  public hasAnyRole(roles: string[], key: 'id' | 'name' = 'name'): boolean {
    if (!this.roles || !this.roles.length) return false;

    return this.roles.some((item) => roles.includes(item[key]));
  }

  public allPermissions(): Permission[] {
    const { permissions = [], roles = [] } = this;

    roles.forEach((item) => {
      if (item.permissions) permissions.push(...item.permissions);
    });

    return uniqBy(permissions, 'name');
  }

  public hasPermission(permission: string | string[], key: 'id' | 'name' = 'name'): boolean {
    const permissions = this.allPermissions();
    if (!permissions.length) return false;

    if (Array.isArray(permission)) {
      const currentPermissionKeys = permissions.map((item) => item[key]);
      return permission.every((item) => currentPermissionKeys.includes(item));
    }

    return !!permissions.find((item) => item[key] === permission);
  }

  public can(permission: string | string[], key: 'id' | 'name' = 'name'): boolean {
    return this.hasPermission(permission, key);
  }

  public hasAnyPermission(permission: string[], key: 'id' | 'name' = 'name'): boolean {
    const permissions = this.allPermissions();
    if (!permissions.length) return false;

    return permissions.some((item) => permission.includes(item[key]));
  }
}
