import { Table, Column, HasOne, HasMany, Scopes } from 'sequelize-typescript';
import BaseModel from '../model';
import UserPassword from './user-password';
import UserRole from './user-role';
import UserSurveyAlias from './user-survey-alias';

@Scopes(() => ({
  legacyPassword: { include: [{ model: UserPassword }] },
  roles: { include: [{ model: UserRole }] },
  aliases: { include: [{ model: UserSurveyAlias }] },
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

  public can(role: string): boolean {
    if (!this.roles) {
      return false;
    }

    const match = this.roles.find((item) => item.role === role);
    return !!match;
  }

  public roleList(): string[] {
    if (!this.roles) return [];

    return this.roles.map((item) => item.role);
  }
}
