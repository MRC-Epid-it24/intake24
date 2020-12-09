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
import BaseModel from '@api-server/db/models/model';
import { User } from '.';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  freezeTableName: true,
  underscored: true,
})
export default class RefreshToken extends BaseModel<RefreshToken> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: number;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public revoked!: boolean;

  @Column
  public expiresAt!: Date;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User)
  public user?: User;
}
