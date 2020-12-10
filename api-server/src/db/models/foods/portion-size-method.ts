import { BelongsTo, Column, HasMany, Table } from 'sequelize-typescript';
import PortionSizeMethodParameter from '@api-server/db/models/foods/portion-size-method-param';
import BaseModel from '../model';
import { FoodLocal } from '.';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_portion_size_methods',
})
export default class PortionSizeMethod extends BaseModel<PortionSizeMethod> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column
  public method!: string;

  @Column
  public description!: string;

  @Column
  public imageUrl!: string;

  @Column
  public useForRecipes!: boolean;

  @Column
  public conversionFactor!: number;

  @BelongsTo(() => FoodLocal, 'food_local_id')
  public foodLocal?: FoodLocal;

  @HasMany(() => PortionSizeMethodParameter, 'portion_size_method_id')
  public parameters?: PortionSizeMethodParameter[];
}
