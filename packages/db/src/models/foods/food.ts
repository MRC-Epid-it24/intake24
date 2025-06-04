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
  Table,
} from 'sequelize-typescript';

import type {
  FoodNutrientCreationAttributes,
  FoodPortionSizeMethodCreationAttributes,
} from '@intake24/db';
import {
  AssociatedFood,
  Brand,
  Category,
  FoodCategory,
  FoodGroup,
  FoodNutrient,
  FoodPortionSizeMethod,
  FoodsLocale,
} from '@intake24/db';

import BaseModel from '../model';
import NutrientTableRecord from './nutrient-table-record';

export type AlternativeFoodNames = Record<string, string[]>;

@Table({
  modelName: 'Food',
  tableName: 'foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Food extends BaseModel<
  InferAttributes<Food>,
  InferCreationAttributes<Food> & {
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
    type: DataType.STRING(36),
  })
  declare code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodGroupId: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  declare name: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  declare simpleName: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  declare englishName: string;

  @Column({
    allowNull: false,
    defaultValue: '{}',
    type: DataType.STRING(2048),
    get(): AlternativeFoodNames {
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
    defaultValue: '[]',
    type: DataType.STRING(2048),
    get(): string[] {
      const val = this.getDataValue('tags') as unknown;
      return val ? JSON.parse(val as string) : [];
    },
    set(value: string[]) {
      this.setDataValue('tags', JSON.stringify(value ?? []));
    },
  })
  declare tags: CreationOptional<string[]>;

  @Column({
    allowNull: false,
    defaultValue: '[]',
    type: DataType.STRING(2048),
    get(): string[] {
      const val = this.getDataValue('excludeTags') as unknown;
      return val ? JSON.parse(val as string) : [];
    },
    set(value: string[]) {
      this.setDataValue('excludeTags', JSON.stringify(value ?? []));
    },
  })
  declare excludeTags: CreationOptional<string[]>;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  declare version: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @HasMany(() => AssociatedFood, 'foodId')
  declare associatedFoods?: NonAttribute<AssociatedFood[]>;

  @HasMany(() => Brand, { foreignKey: 'foodCode', sourceKey: 'code' })
  declare brands?: NonAttribute<Brand[]>;

  @BelongsToMany(() => Category, () => FoodCategory)
  declare parentCategories?: NonAttribute<Category[]>;

  @HasMany(() => FoodCategory, 'foodId')
  declare parentCategoryMappings?: NonAttribute<FoodCategory[]>;

  @HasMany(() => AssociatedFood, { foreignKey: 'associatedFoodCode', sourceKey: 'code' })
  declare foodAssociations?: NonAttribute<AssociatedFood[]>;

  @BelongsTo(() => FoodGroup, 'foodGroupId')
  declare foodGroup?: NonAttribute<FoodGroup>;

  @HasMany(() => FoodPortionSizeMethod, 'foodId')
  declare portionSizeMethods?: NonAttribute<FoodPortionSizeMethod[]>;

  @BelongsToMany(() => NutrientTableRecord, () => FoodNutrient)
  declare nutrientRecords?: NonAttribute<NutrientTableRecord[]>;

  @HasMany(() => FoodNutrient, 'foodId')
  declare nutrientMappings?: NonAttribute<FoodNutrient[]>;
}

export type FoodAttributes = Attributes<Food>;
export type FoodCreationAttributes = CreationAttributes<Food>;
