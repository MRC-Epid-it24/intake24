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
export default class User extends BaseModel implements UserAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

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

  @HasMany(() => SignInLog, 'userId')
  public signInLog?: SignInLog[];

  @HasMany(() => SurveySubmission, 'userId')
  public submissions?: SurveySubmission[];

  @HasMany(() => UserSubscription, 'userId')
  public subscription?: UserSubscription[];

  @BelongsToMany(() => Role, () => RoleUser)
  public roles?: Role[];

  @HasMany(() => RefreshToken)
  public tokens?: RefreshToken[];

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
