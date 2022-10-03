/* eslint-disable no-use-before-define */
import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';

import type {
  FoodsLocaleAttributes,
  FoodsLocaleCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { AssociatedFood, SplitList, SplitWord, SynonymSet } from '.';

@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Locale
  extends BaseModel<FoodsLocaleAttributes, FoodsLocaleCreationAttributes>
  implements FoodsLocaleAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(16),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public englishName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public localName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public respondentLanguageId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public adminLanguageId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public countryFlagCode!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(16),
  })
  public prototypeLocaleId!: string | null;

  @Column({
    allowNull: false,
    defaultValue: 'ltr',
    type: DataType.STRING(8),
  })
  public textDirection!: string;

  @Column({
    allowNull: false,
    defaultValue: 'en',
    type: DataType.STRING(16),
  })
  public foodIndexLanguageBackendId!: string;

  @BelongsTo(() => Locale, 'prototypeLocaleId')
  public parent?: Locale | null;

  @HasMany(() => Locale, 'prototypeLocaleId')
  public children?: Locale[];

  @HasMany(() => AssociatedFood, 'localeId')
  public associatedFoods?: AssociatedFood[];

  @HasMany(() => SplitList, 'localeId')
  public splitLists?: SplitList[];

  @HasMany(() => SplitWord, 'localeId')
  public splitWords?: SplitWord[];

  @HasMany(() => SynonymSet, 'localeId')
  public synonymSets?: SynonymSet[];
}
