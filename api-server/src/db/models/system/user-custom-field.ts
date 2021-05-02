import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { UserCustomFieldAttributes, UserCustomFieldCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserCustomField',
  tableName: 'user_custom_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserCustomField
  extends BaseModel<UserCustomFieldAttributes, UserCustomFieldCreationAttributes>
  implements UserCustomFieldAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
