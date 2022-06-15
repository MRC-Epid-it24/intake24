import { BelongsTo, Column, DataType, HasOne, Scopes, Table } from 'sequelize-typescript';
import type { NutrientTypeAttributes } from '@intake24/common/types/models';
import { FoodsNutrientUnit, NutrientTypeInKcal } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  unit: { include: [{ model: FoodsNutrientUnit }] },
  inKcal: { include: [{ model: NutrientTypeInKcal }] },
  list: { order: [['id', 'ASC']] },
}))
@Table({
  modelName: 'NutrientType',
  tableName: 'nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientType
  extends BaseModel<NutrientTypeAttributes>
  implements NutrientTypeAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public unitId!: string;

  @BelongsTo(() => FoodsNutrientUnit, 'unitId')
  public unit?: FoodsNutrientUnit;

  @HasOne(() => NutrientTypeInKcal, 'nutrientTypeId')
  public inKcal?: NutrientTypeInKcal;
}
