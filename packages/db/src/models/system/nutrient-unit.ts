import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { NutrientUnitAttributes } from '@common/types/models';
import BaseModel from '../model';
import { SystemNutrientType } from '.';

@Scopes(() => ({
  nutrientTypes: { include: [{ model: SystemNutrientType }] },
}))
@Table({
  modelName: 'NutrientUnit',
  tableName: 'nutrient_units',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientUnit
  extends BaseModel<NutrientUnitAttributes>
  implements NutrientUnitAttributes
{
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public symbol!: string;

  @HasMany(() => SystemNutrientType, 'unitId')
  public nutrientTypes?: SystemNutrientType[];
}
