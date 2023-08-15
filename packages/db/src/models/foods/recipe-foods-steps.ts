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

import { FoodCategory, FoodsLocale } from '@intake24/db';

import BaseModel from '../model';
import RecipeFoods from './recipe-foods';

@Scopes(() => ({
  list: {
    attributes: ['id', 'recipeFoodsId', 'code', 'order'],
    order: [['order', 'ASC']],
  },
}))
@Table({
  modelName: 'RecipeFoodsSteps',
  tableName: 'recipe_foods_steps',
  freezeTableName: true,
  underscored: true,
})
export default class RecipeFoodsSteps extends BaseModel<
  InferAttributes<RecipeFoodsSteps>,
  InferCreationAttributes<RecipeFoodsSteps>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => RecipeFoods)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: false,
  })
  declare recipeFoodsId: number;

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
    unique: false,
  })
  declare categoryCode: string;

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
  declare name: string;

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
          'recipeFoodsId'
        )}`,
      }),
    type: DataType.TEXT({ length: 'long' }),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare repeatable: boolean;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => RecipeFoods, 'recipeFoodsId')
  declare recipeFoods?: NonAttribute<RecipeFoods>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @BelongsTo(() => FoodCategory, 'categoryCode')
  declare category?: NonAttribute<FoodCategory>;
}

export type RecipeFoodsStepsAttributes = Attributes<RecipeFoodsSteps>;
export type RecipeFoodsStepsCreationAttributes = CreationAttributes<RecipeFoodsSteps>;
