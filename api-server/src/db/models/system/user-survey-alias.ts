import { BelongsTo, Column, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';
import User from './user';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class UserSurveyAlias extends BaseModel<UserSurveyAlias> {
  @Column({
    allowNull: false,
  })
  @ForeignKey(() => User)
  public userId!: number;

  @Column({
    allowNull: false,
    primaryKey: true,
  })
  @ForeignKey(() => Survey)
  public surveyId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public userName!: string;

  @Column({
    allowNull: false,
  })
  public urlAuthToken!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey[];
}
