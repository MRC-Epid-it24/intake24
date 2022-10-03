import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { TextDirection } from '@intake24/common/types';
import type { LanguageAttributes, LanguageCreationAttributes } from '@intake24/common/types/models';

import type { Securable } from '..';
import BaseModel from '../model';
import { LanguageTranslation, User, UserSecurable } from '.';
import Locale from './locale';

@Scopes(() => ({
  public: {
    attributes: ['code', 'englishName', 'localName', 'countryFlagCode', 'textDirection'],
    order: [['englishName', 'ASC']],
  },
  list: {
    attributes: ['id', 'code', 'englishName', 'localName', 'countryFlagCode'],
    order: [['englishName', 'ASC']],
  },
  adminLocales: { include: [{ association: 'adminLocales' }] },
  surveyLocales: { include: [{ association: 'surveyLocales' }] },
}))
@Table({
  modelName: 'Language',
  tableName: 'languages',
  freezeTableName: true,
  underscored: true,
})
export default class Language
  extends BaseModel<LanguageAttributes, LanguageCreationAttributes>
  implements LanguageAttributes, Securable
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
    unique: true,
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public englishName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public localName!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public countryFlagCode!: string;

  @Column({
    allowNull: false,
    defaultValue: 'ltr',
    type: DataType.STRING(16),
  })
  public textDirection!: TextDirection;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public ownerId!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => LanguageTranslation, 'languageId')
  public translations?: LanguageTranslation[];

  @HasMany(() => Locale, {
    foreignKey: 'adminLanguageId',
    sourceKey: 'code',
  })
  public adminLocales?: Locale[];

  @HasMany(() => Locale, {
    foreignKey: 'respondentLanguageId',
    sourceKey: 'code',
  })
  public surveyLocales?: Locale[];

  @BelongsTo(() => User, 'ownerId')
  public owner?: User | null;

  @BelongsToMany(() => User, {
    through: {
      model: () => UserSecurable,
      unique: false,
      scope: {
        securable_type: 'Language',
      },
    },
    foreignKey: 'securableId',
    otherKey: 'userId',
    constraints: false,
  })
  public securableUsers?: User[];

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'Language' },
  })
  public securables?: UserSecurable[];
}
