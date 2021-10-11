import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Sex, WeightTarget, UserPhysicalDataAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserPhysicalData',
  tableName: 'user_physical_data',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class UserPhysicalData
  extends BaseModel<UserPhysicalDataAttributes>
  implements UserPhysicalDataAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public sex!: Sex | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public weightKg!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public heightCm!: number | null;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public physicalActivityLevelId!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  public birthdate!: Date | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public weightTarget!: WeightTarget | null;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
