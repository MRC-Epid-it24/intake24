import {
  BelongsToMany,
  Column,
  DataType,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import BaseModel from '@api-server/db/models/model';
import { RoleAttributes, RoleCreationAttributes } from '@common/types/models';
import { Permission, PermissionRole, RoleUser, User } from '.';

@Scopes(() => ({
  list: { attributes: ['id', 'name', 'displayName'] },
  permissions: { include: [{ model: Permission, through: { attributes: [] } }] },
  users: { include: [{ model: User, through: { attributes: [] } }] },
}))
@Table({
  modelName: 'Role',
  tableName: 'roles',
  freezeTableName: true,
  underscored: true,
})
export default class Role
  extends BaseModel<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public displayName!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public description!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsToMany(() => User, () => RoleUser)
  public users?: User[];

  @BelongsToMany(() => Permission, () => PermissionRole)
  public permissions?: Permission[];
}
