import { Column, DataType, Scopes, Table } from 'sequelize-typescript';

import type {
  PhysicalActivityLevelAttributes,
  PhysicalActivityLevelCreationAttributes,
} from '@intake24/common/types/models/foods';

import BaseModel from '../model';

@Scopes(() => ({
  list: { order: [['id', 'ASC']] },
}))
@Table({
  modelName: 'PhysicalActivityLevel',
  tableName: 'physical_activity_levels',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PhysicalActivityLevel
  extends BaseModel<PhysicalActivityLevelAttributes, PhysicalActivityLevelCreationAttributes>
  implements PhysicalActivityLevelAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public coefficient!: number;
}
