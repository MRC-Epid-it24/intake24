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
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { FoodsLocale } from '@intake24/db';

import BaseModel from '../model';
import SpecialFoodsSteps from './special-foods-steps';

@Scopes(() => ({
  list: {
    attributes: ['id', 'code', 'name', 'localeId', 'specialWords', 'synonyms'],
    order: [['name', 'ASC']],
  },
  steps: { include: [{ model: SpecialFoodsSteps }] },
}))
@Table({
  modelName: 'SpecialFoods',
  tableName: 'special_foods',
  freezeTableName: true,
  underscored: true,
})
export default class SpecialFoods extends BaseModel<
  InferAttributes<SpecialFoods>,
  InferCreationAttributes<SpecialFoods>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
    unique: true,
  })
  declare code: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare localeId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare specialWords: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare synonyms: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare ownerId: CreationOptional<string | null>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @HasMany(() => SpecialFoodsSteps, 'specialFoodsId')
  steps?: NonAttribute<SpecialFoodsSteps[]>;

  static async findByCode(code: string): Promise<SpecialFoods | null> {
    return SpecialFoods.findOne({ where: { code }, include: [{ model: SpecialFoodsSteps }] });
  }

  static async findByLocaleId(localeId: string): Promise<SpecialFoods[]> {
    return SpecialFoods.findAll({ where: { localeId } });
  }

  static async findByLocaleIdAndCode(localeId: string, code: string): Promise<SpecialFoods | null> {
    return SpecialFoods.findOne({ where: { localeId, code } });
  }
}

export type SpecialFoodsAttributes = Attributes<SpecialFoods>;
export type SpecialFoodsCreationAttributes = CreationAttributes<SpecialFoods>;
