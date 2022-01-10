import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  FoodPortionSizeMethodAttributes,
  FoodPortionSizeMethodCreationAttributes,
  PortionSizeMethodId,
} from '@intake24/common/types/models/foods';
import { FoodLocal, FoodPortionSizeMethodParameter } from '@intake24/db';
import BaseModel from '../model';

@Table({
  modelName: 'FoodPortionSizeMethod',
  tableName: 'food_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodPortionSizeMethod
  extends BaseModel<FoodPortionSizeMethodAttributes, FoodPortionSizeMethodCreationAttributes>
  implements FoodPortionSizeMethodAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodLocalId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public method!: PortionSizeMethodId;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public imageUrl!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public useForRecipes!: boolean;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17),
  })
  public conversionFactor!: number;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  public foodLocal?: FoodLocal;

  @HasMany(() => FoodPortionSizeMethodParameter, 'portionSizeMethodId')
  public parameters?: FoodPortionSizeMethodParameter[];
}
