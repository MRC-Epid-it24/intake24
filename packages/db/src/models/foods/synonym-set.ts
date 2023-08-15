import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { FoodsLocale, RecipeFoods } from '.';

@Table({
  modelName: 'SynonymSet',
  tableName: 'synonym_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SynonymSet extends BaseModel<
  InferAttributes<SynonymSet>,
  InferCreationAttributes<SynonymSet>
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
  })
  declare localeId: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  declare synonyms: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  declare locale?: NonAttribute<FoodsLocale>;

  @HasMany(() => RecipeFoods, 'id')
  declare recipeFoods?: NonAttribute<RecipeFoods>;
}

export type SynonymSetAttributes = Attributes<SynonymSet>;
export type SynonymSetCreationAttributes = CreationAttributes<SynonymSet>;
