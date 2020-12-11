import { BelongsTo, Column, HasMany, Table } from 'sequelize-typescript';
import PortionSizeMethodParameter from '@api-server/db/models/foods/portion-size-method-param';
import BaseModel from '../model';
import { FoodLocal } from '.';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_nutrient_mapping',
})
export default class NutrientMapping extends BaseModel<NutrientMapping> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column
  public nutrientTableId!: string;

  @Column
  public nutrientTableRecordId!: string;

  @BelongsTo(() => FoodLocal, 'food_local_id')
  public foodLocal?: FoodLocal;
}
