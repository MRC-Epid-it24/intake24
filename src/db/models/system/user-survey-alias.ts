import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';
import User from './user';

@Table({
  timestamps: false,
  underscored: true,
})
export default class UserSurveyAliases extends BaseModel<UserSurveyAliases> {
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
  public user?: User[];

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey[];
}
