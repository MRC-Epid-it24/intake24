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
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Scopes,
  Sequelize,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';
import { FoodCategory, FoodsLocale } from '@intake24/db';

import BaseModel from '../model';
import RecipeFood from './recipe-food';

@Scopes(() => ({
  list: {
    attributes: [
      'id',
      'recipeFoodsId',
      'code',
      'order',
      'name',
      'description',
      'repeatable',
      'required',
    ],
    order: [['order', 'ASC']],
  },
}))
@Table({
  modelName: 'RecipeFoodStep',
  tableName: 'recipe_foods_steps',
  freezeTableName: true,
  underscored: true,
})
export default class RecipeFoodStep extends BaseModel<
  InferAttributes<RecipeFoodStep>,
  InferCreationAttributes<RecipeFoodStep>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => RecipeFood)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare recipeFoodsId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
    unique: true,
  })
  declare code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @ForeignKey(() => FoodCategory)
  @Column({
    allowNull: true,
    type: DataType.STRING(16),
  })
  declare categoryCode: string | null;

  @Column({
    allowNull: false,
    defaultValue: () =>
      JSON.stringify([
        {
          en: `${Sequelize.col('id')}-${Sequelize.col('recipeFoodsId')}${Sequelize.col('code')}`,
        },
      ]),
    type: DataType.TEXT({ length: 'long' }),
  })
  get name(): LocaleTranslation {
    const val = this.getDataValue('name') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set name(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('name', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare order: number;

  @Column({
    allowNull: false,
    defaultValue: () =>
      JSON.stringify({
        en: `Step description for step ${Sequelize.col('name')} of special food ${Sequelize.col(
          'recipeFoodsId',
        )}`,
      }),
    type: DataType.TEXT({ length: 'long' }),
  })
  get description(): LocaleTranslation {
    const val = this.getDataValue('description') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set description(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('description', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare repeatable: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare required: boolean;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => RecipeFood, 'recipeFoodsId')
  declare recipeFood?: NonAttribute<RecipeFood>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @BelongsTo(() => FoodCategory, 'categoryCode')
  declare category?: NonAttribute<FoodCategory>;
}

export type RecipeFoodStepAttributes = Attributes<RecipeFoodStep>;
export type RecipeFoodsStepCreationAttributes = CreationAttributes<RecipeFoodStep>;
