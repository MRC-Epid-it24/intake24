import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import PortionSizeMethodParameter from '@api-server/db/models/foods/portion-size-method-param';
import BaseModel from '../model';
import { FoodLocal } from '.';

@Table({
  modelName: 'PortionSizeMethod',
  tableName: 'food_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PortionSizeMethod extends BaseModel<PortionSizeMethod> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodLocalId!: number;

  @Column({
    allowNull: false,
  })
  public method!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public imageUrl!: string;

  @Column({
    allowNull: false,
  })
  public useForRecipes!: boolean;

  @Column({
    allowNull: false,
  })
  public conversionFactor!: number;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  public foodLocal?: FoodLocal;

  @HasMany(() => PortionSizeMethodParameter, 'portionSizeMethodId')
  public parameters?: PortionSizeMethodParameter[];
}
