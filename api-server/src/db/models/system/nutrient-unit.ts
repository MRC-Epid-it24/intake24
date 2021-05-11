import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { NutrientUnitAttributes, NutrientUnitCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { NutrientType } from '.';

@Scopes(() => ({
  nutrientTypes: { include: [{ model: NutrientType }] },
}))
@Table({
  modelName: 'NutrientType',
  tableName: 'nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientUnit
  extends BaseModel<NutrientUnitAttributes, NutrientUnitCreationAttributes>
  implements NutrientUnitAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

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

  @HasMany(() => NutrientType, 'unitId')
  public nutrientTypes?: NutrientType[];
}
