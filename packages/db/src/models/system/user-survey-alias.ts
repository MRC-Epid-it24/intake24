import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import type {
  UserSurveyAliasAttributes,
  UserSurveyAliasCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { Survey, User } from '.';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserSurveyAlias',
  tableName: 'user_survey_aliases',
  freezeTableName: true,
  underscored: true,
})
export default class UserSurveyAlias
  extends BaseModel<UserSurveyAliasAttributes, UserSurveyAliasCreationAttributes>
  implements UserSurveyAliasAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: 'survey_id_username_unique',
  })
  @ForeignKey(() => Survey)
  public surveyId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(256),
    unique: 'survey_id_username_unique',
  })
  public username!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(128),
  })
  public urlAuthToken!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
