import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { UserPhysicalDataAttributes } from '@intake24/common/types/models';
import { Sex, WeightTarget } from '@intake24/common/feedback';
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
  public sex!: Sex;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public weightKg!: number;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public heightCm!: number;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public physicalActivityLevelId!: string;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  get birthdate(): number {
    const birthdate = this.getDataValue('birthdate') as unknown as string;

    return parseInt(birthdate.slice(0, 4), 10);
  }

  set birthdate(value: number | string) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('birthdate', typeof value === 'number' ? value.toString() : value);
  }

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public weightTarget!: WeightTarget;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
