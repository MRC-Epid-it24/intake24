import { Column, DataType, ForeignKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { RoleUserAttributes, RoleUserCreationAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import { Role, User } from '.';

@Table({
  modelName: 'RoleUser',
  tableName: 'role_user',
  freezeTableName: true,
  underscored: true,
})
export default class RoleUser
  extends BaseModel<RoleUserAttributes, RoleUserCreationAttributes>
  implements RoleUserAttributes
{
  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
  })
  public roleId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  public userId!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
