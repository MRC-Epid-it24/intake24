import type {
  Attributes,
  CreationAttributes,
  ForeignKey as ForeignKeyBrand,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  // ForeignKey as ForeignKeyDec,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { Food, NutrientTableRecord } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'FoodNutrient',
  tableName: 'foods_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodNutrient extends BaseModel<
  InferAttributes<FoodNutrient>,
  InferCreationAttributes<FoodNutrient>
> {
  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodId: ForeignKeyBrand<Food['id']>;

  @ForeignKey(() => NutrientTableRecord)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare nutrientTableRecordId: ForeignKeyBrand<NutrientTableRecord['id']>;

  @BelongsTo(() => Food, 'foodId')
  declare food?: NonAttribute<Food>;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  declare nutrientTableRecord?: NonAttribute<NutrientTableRecord>;
}

export type FoodNutrientAttributes = Attributes<FoodNutrient>;
export type FoodNutrientCreationAttributes = CreationAttributes<FoodNutrient>;
