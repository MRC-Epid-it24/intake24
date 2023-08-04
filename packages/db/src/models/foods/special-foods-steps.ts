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
  HasMany,
  Scopes,
  Sequelize,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { FoodsLocale } from '@intake24/db';

import BaseModel from '../model';
import SpecialFoods from './special-foods';
import SpecialFoodsCategoryFoods from './special-foods-category-foods';

@Scopes(() => ({
  list: {
    attributes: ['id', 'specialFoodsCode', 'code', 'order'],
    order: [['specialFoodsCode', 'ASC']],
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
    type: DataType.STRING(16),
    unique: false,
  })
  declare specialFoodsCode: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
    unique: true,
  })
  declare code: string;

  @Column({
    allowNull: false,
    defaultValue: () =>
      JSON.stringify([
        {
          en: `${Sequelize.col('id')}-${Sequelize.col('specialFoodsCode')}${Sequelize.col('code')}`,
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
          'specialFoodsCode'
        )}`,
      }),
    type: DataType.TEXT({ length: 'long' }),
  })
  declare description: string;

  // @Column({
  //   allowNull: false,
  //   defaultValue: () => JSON.stringify(defaultSteps),
  //   type: DataType.TEXT({ length: 'long' }),
  // })
  // get steps(): CreationOptional<SpecialFoodStepsType[]> {
  //   const val = this.getDataValue('steps') as unknown;
  //   return val ? JSON.parse(val as string) : defaultSteps;
  // }

  // set steps(value: SpecialFoodStepsType[]) {
  //   // @ts-expect-error: Sequelize/TS issue for setting custom values
  //   this.setDataValue('steps', JSON.stringify(value ?? defaultSteps));
  // }

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare ownerId: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => SpecialFoods, 'specialFoodsCode')
  declare specialFoods?: NonAttribute<FoodsLocale>;

  @HasMany(() => SpecialFoodsCategoryFoods, 'specialFoodsStepCode')
  declare specialFoodsCategoryFoods?: NonAttribute<SpecialFoodsCategoryFoods[]>;
}

export type SpecialFoodsStepsAttributes = Attributes<SpecialFoodsSteps>;
export type SpecialFoodsStepsCreationAttributes = CreationAttributes<SpecialFoodsSteps>;
