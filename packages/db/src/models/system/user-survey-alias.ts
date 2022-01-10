import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import { UserSurveyAliasAttributes } from '@intake24/common/types/models';
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
export default class UserSurveyAlias
  extends BaseModel<UserSurveyAliasAttributes>
  implements UserSurveyAliasAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(64),
    unique: 'survey_id_user_name_unique',
  })
  @ForeignKey(() => Survey)
  public surveyId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(256),
    unique: 'survey_id_user_name_unique',
  })
  public userName!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(128),
  })
  public urlAuthToken!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey[];
}
