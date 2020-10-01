import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Role, User } from '.';

@Table({
  modelName: 'RoleUser',
  tableName: 'role_user',
  freezeTableName: true,
  underscored: true,
})
export default class RoleUser extends Model<RoleUser> {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
  })
  public roleId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  public userId!: number;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
