import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';

import type { TextDirection } from '@intake24/common/types';

import { AssociatedFood, SplitList, SplitWord, SynonymSet } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Locale extends BaseModel<
  InferAttributes<Locale>,
  InferCreationAttributes<Locale>
> {
  @Column({
    primaryKey: true,
    type: DataType.STRING(16),
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare englishName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare localName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare respondentLanguageId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare adminLanguageId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  declare countryFlagCode: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(16),
  })
  declare prototypeLocaleId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    defaultValue: 'ltr',
    type: DataType.STRING(8),
  })
  declare textDirection: CreationOptional<TextDirection>;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare foodIndexEnabled: CreationOptional<boolean>;

  @Column({
    allowNull: false,
    defaultValue: 'en',
    type: DataType.STRING(16),
  })
  declare foodIndexLanguageBackendId: CreationOptional<string>;

  @BelongsTo(() => Locale, 'prototypeLocaleId')
  declare parent?: NonAttribute<Locale | null>;

  @HasMany(() => Locale, 'prototypeLocaleId')
  declare children?: NonAttribute<Locale[]>;

  @HasMany(() => AssociatedFood, 'localeId')
  declare associatedFoods?: AssociatedFood[];

  @HasMany(() => SplitList, 'localeId')
  declare splitLists?: NonAttribute<SplitList[]>;

  @HasMany(() => SplitWord, 'localeId')
  declare splitWords?: NonAttribute<SplitWord[]>;

  @HasMany(() => SynonymSet, 'localeId')
  declare synonymSets?: NonAttribute<SynonymSet[]>;
}

export type FoodsLocaleAttributes = Attributes<Locale>;
export type FoodsLocaleCreationAttributes = CreationAttributes<Locale>;
