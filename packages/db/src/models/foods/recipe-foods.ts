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

import { FoodsLocale, SynonymSet } from '@intake24/db';

import BaseModel from '../model';
import RecipeFoodsSteps from './recipe-foods-steps';

@Scopes(() => ({
  list: {
    attributes: ['id', 'code', 'name', 'localeId', 'recipeWord', 'synonyms'],
    order: [['name', 'ASC']],
  },
  steps: { include: [{ model: RecipeFoodsSteps }] },
  synonyms: { include: [{ model: SynonymSet }] },
}))
@Table({
  modelName: 'RecipeFoods',
  tableName: 'recipe_foods',
  freezeTableName: true,
  underscored: true,
})
export default class RecipeFoods extends BaseModel<
  InferAttributes<RecipeFoods>,
  InferCreationAttributes<RecipeFoods>
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
    unique: false,
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
  declare recipeWord: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
    unique: false,
  })
  declare synonyms_id: number;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @BelongsTo(() => SynonymSet, 'synonyms_id')
  declare synonyms?: NonAttribute<SynonymSet>;

  @HasMany(() => RecipeFoodsSteps, 'recipeFoodsId')
  steps?: NonAttribute<RecipeFoodsSteps[]>;

  static async findByCode(code: string): Promise<RecipeFoods | null> {
    return RecipeFoods.findOne({ where: { code }, include: [{ model: RecipeFoodsSteps }] });
  }

  static async findByLocaleId(localeId: string): Promise<RecipeFoods[]> {
    return RecipeFoods.findAll({ where: { localeId } });
  }

  static async findByLocaleIdAndCode(localeId: string, code: string): Promise<RecipeFoods | null> {
    return RecipeFoods.findOne({ where: { localeId, code } });
  }
}

export type RecipeFoodsAttributes = Attributes<RecipeFoods>;
export type RecipeFoodsCreationAttributes = CreationAttributes<RecipeFoods>;
