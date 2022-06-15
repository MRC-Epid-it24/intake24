import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import type { UserPhysicalDataAttributes } from '@intake24/common/types/models';
import type { Sex, WeightTarget } from '@intake24/common/feedback';
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
  public physicalActivityLevelId!: string | null;

  @Column({
    allowNull: true,
    type: DataType.DATEONLY,
  })
  get birthdate(): number | null {
    const birthdate = this.getDataValue('birthdate') as unknown;
    if (typeof birthdate === 'string') return parseInt(birthdate.slice(0, 4), 10);

    return null;
  }

  set birthdate(value: number | string | null) {
    if (value === null) {
      this.setDataValue('birthdate', value);
      return;
    }

    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('birthdate', typeof value === 'number' ? value.toString() : value);
  }

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public weightTarget!: WeightTarget | null;

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
