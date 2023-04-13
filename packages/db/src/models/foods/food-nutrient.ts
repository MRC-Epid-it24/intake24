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

import BaseModel from '../model';
import { FoodLocal, NutrientTableRecord } from '.';

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
  @ForeignKey(() => FoodLocal)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodLocalId: ForeignKeyBrand<FoodLocal['id']>;

  @ForeignKey(() => NutrientTableRecord)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare nutrientTableRecordId: ForeignKeyBrand<NutrientTableRecord['id']>;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  declare foodLocal?: NonAttribute<FoodLocal>;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  declare nutrientTableRecord?: NonAttribute<NutrientTableRecord>;
}

export type FoodNutrientAttributes = Attributes<FoodNutrient>;
export type FoodNutrientCreationAttributes = CreationAttributes<FoodNutrient>;
