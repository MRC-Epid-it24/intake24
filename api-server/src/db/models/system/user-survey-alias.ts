import { BelongsTo, Column, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { Survey, User } from '.';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserSurveyAlias',
  tableName: 'user_survey_aliases',
  freezeTableName: true,
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
