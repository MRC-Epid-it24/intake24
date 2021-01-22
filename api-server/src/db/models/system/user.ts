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
import { User as UserAttributes } from '@common/types/models';
import BaseModel from '../model';
import {
  ClientErrorReport,
  Permission,
  PermissionUser,
  RefreshToken,
  Role,
  RoleUser,
  SignInLog,
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
  signInLog: { include: [{ model: SignInLog }] },
  aliases: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
  tokens: { include: [{ model: RefreshToken }] },
  clientErrors: { include: [{ model: ClientErrorReport }] },
}))
@Table({
  modelName: 'User',
  tableName: 'users',
  freezeTableName: true,
  underscored: true,
})
export default class User extends BaseModel<User> implements UserAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public name!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public email!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public phone!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public simpleName!: string | null;

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

  @BelongsToMany(() => Permission, () => PermissionUser)
  public permissions?: Permission[];

  @BelongsToMany(() => Role, () => RoleUser)
  public roles?: Role[];

  @HasMany(() => RefreshToken)
  public tokens?: RefreshToken[];

  @HasMany(() => SignInLog, 'userId')
  public signInLog?: SignInLog[];

  @HasMany(() => SurveySubmission, 'userId')
  public submissions?: SurveySubmission[];

  @HasOne(() => UserPassword, 'userId')
  public password?: UserPassword;

  @HasMany(() => UserPasswordReset, 'userId')
  public passwordResets?: UserPasswordReset[];

  @HasMany(() => UserSurveyAlias, 'userId')
  public aliases?: UserSurveyAlias[];

  @HasMany(() => ClientErrorReport, 'userId')
  public clientErrors?: ClientErrorReport[];

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
    const { permissions = [], roles = [] } = this;

    roles.forEach((item) => {
      if (item.permissions) permissions.push(...item.permissions);
    });

    return uniqBy(permissions, 'name');
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
