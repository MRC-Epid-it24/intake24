import { Table, Column, HasOne, HasMany, Scopes } from 'sequelize-typescript';
import BaseModel from '../model';
import SurveySubmission from './survey-submission';
import UserPassword from './user-password';
import UserRole from './user-role';
import UserSurveyAlias from './user-survey-alias';

@Scopes(() => ({
  legacyPassword: { include: [{ model: UserPassword }] },
  roles: { include: [{ model: UserRole }] },
  aliases: { include: [{ model: UserSurveyAlias }] },
  submissions: { include: [{ model: SurveySubmission }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class User extends BaseModel<User> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
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

  @Column
  public password!: string;

  @Column({
    allowNull: false,
  })
  public emailNotifications!: boolean;

  @Column({
    allowNull: false,
  })
  public smsNotifications!: boolean;

  @HasOne(() => UserPassword, 'userId')
  public legacyPassword?: UserPassword;

  @HasMany(() => UserRole, 'userId')
  public roles?: UserRole[];

  @HasMany(() => UserSurveyAlias, 'userId')
  public aliases?: UserSurveyAlias[];

  @HasMany(() => SurveySubmission, 'userId')
  public submissions?: SurveySubmission[];

  public hasRole(role: string): boolean {
    if (!this.roles) return false;

    const match = this.roles.find((item) => item.role === role);
    return !!match;
  }

  public hasAnyRole(roles: string[]): boolean {
    if (!this.roles) return false;

    return this.roles.some((item) => roles.includes(item.role));
  }

  public can(role: string): boolean {
    return this.hasRole(role);
  }

  public roleList(): string[] {
    if (!this.roles) return [];

    return this.roles.map((item) => item.role);
  }
}
