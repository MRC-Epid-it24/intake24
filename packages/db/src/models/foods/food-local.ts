import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';
import type {
  FoodNutrientCreationAttributes,
  FoodPortionSizeMethodCreationAttributes,
} from '@intake24/db';
import {
  AssociatedFood,
  Food,
  FoodLocalList,
  FoodNutrient,
  FoodPortionSizeMethod,
  FoodsLocale,
} from '@intake24/db';

import BaseModel from '../model';
import NutrientTableRecord from './nutrient-table-record';

export type AlternativeFoodNames = Record<string, string[]>;

@Scopes(() => ({
  food: { include: [{ model: Food }] },
  locale: { include: [{ model: FoodsLocale }] },
  localeLists: { include: [{ model: FoodLocalList }] },
}))
@Table({
  modelName: 'FoodLocal',
  tableName: 'food_locals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodLocal extends BaseModel<
  InferAttributes<FoodLocal>,
  InferCreationAttributes<FoodLocal> & {
    portionSizeMethods?: FoodPortionSizeMethodCreationAttributes[];
    nutrientMappings?: FoodNutrientCreationAttributes[];
  }
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare foodCode: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @Column({
    type: DataType.STRING(256),
  })
  declare name: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  declare simpleName: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(2048),
    get() {
      const val = this.getDataValue('altNames') as unknown;
      return val ? JSON.parse(val as string) : {};
    },
    set(value: AlternativeFoodNames) {
      this.setDataValue('altNames', JSON.stringify(value ?? {}));
    },
  })
  declare altNames: CreationOptional<AlternativeFoodNames>;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare version: string;

  @BelongsTo(() => Food, 'foodCode')
  declare main?: NonAttribute<Food>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @HasMany(() => AssociatedFood, { foreignKey: 'foodCode', sourceKey: 'foodCode' })
  declare associatedFoods?: NonAttribute<AssociatedFood[]>;

  @HasMany(() => FoodPortionSizeMethod, 'foodLocalId')
  declare portionSizeMethods?: NonAttribute<FoodPortionSizeMethod[]>;

  @BelongsToMany(() => NutrientTableRecord, () => FoodNutrient)
  declare nutrientRecords?: NonAttribute<NutrientTableRecord[]>;

  @HasMany(() => FoodNutrient, 'foodLocalId')
  declare nutrientMappings?: NonAttribute<FoodNutrient[]>;
}

export type FoodLocalAttributes = Attributes<FoodLocal>;
export type FoodLocalCreationAttributes = CreationAttributes<FoodLocal>;
