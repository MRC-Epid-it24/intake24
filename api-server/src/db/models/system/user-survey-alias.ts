import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import { UserSurveyAlias as UserSurveyAliasAttributes } from '@common/types/models';
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
export default class UserSurveyAlias extends BaseModel implements UserSurveyAliasAttributes {
  @Column({
    allowNull: false,
  })
  @ForeignKey(() => User)
  public userId!: number;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  @ForeignKey(() => Survey)
  public surveyId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(256),
  })
  public userName!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(32),
  })
  public urlAuthToken!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey[];
}
