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
import SpecialFoods from './special-foods';

@Scopes(() => ({
  list: {
    attributes: ['id', 'specialFoodsId', 'code', 'order'],
    order: [['order', 'ASC']],
  },
}))
@Table({
  modelName: 'SpecialFoodsSteps',
  tableName: 'special_foods_steps',
  freezeTableName: true,
  underscored: true,
})
export default class SpecialFoodsSteps extends BaseModel<
  InferAttributes<SpecialFoodsSteps>,
  InferCreationAttributes<SpecialFoodsSteps>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @ForeignKey(() => SpecialFoods)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: false,
  })
  declare specialFoodsId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
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
          en: `${Sequelize.col('id')}-${Sequelize.col('specialFoodsId')}${Sequelize.col('code')}`,
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
          'specialFoodsId'
        )}`,
      }),
    type: DataType.TEXT({ length: 'long' }),
  })
  declare description: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare ownerId: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => SpecialFoods, 'specialFoodsId')
  declare specialFoods?: NonAttribute<SpecialFoods>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @BelongsTo(() => FoodCategory, 'categoryCode')
  declare category?: NonAttribute<FoodCategory>;
}

export type SpecialFoodsStepsAttributes = Attributes<SpecialFoodsSteps>;
export type SpecialFoodsStepsCreationAttributes = CreationAttributes<SpecialFoodsSteps>;
