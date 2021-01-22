import { Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import { NutrientUnit as NutrientUnitAttributes } from '@common/types/models';
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
  extends BaseModel<NutrientUnit>
  implements NutrientUnitAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public symbol!: string;

  @HasMany(() => NutrientType, 'unitId')
  public nutrientTypes?: NutrientType[];
}
