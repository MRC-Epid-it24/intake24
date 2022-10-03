/* eslint-disable no-use-before-define */
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

import type { LocaleAttributes, LocaleCreationAttributes } from '@intake24/common/types/models';

import type { Securable } from '..';
import BaseModel from '../model';
import { Language, Survey, User, UserSecurable } from '.';
import FoodIndexBackend from './food-index-backend';

@Scopes(() => ({
  list: {
    attributes: ['id', 'code', 'englishName', 'localName', 'countryFlagCode'],
    order: [['englishName', 'ASC']],
  },
  adminLanguage: { include: [{ model: Language, as: 'adminLanguage' }] },
  surveyLanguage: { include: [{ model: Language, as: 'surveyLanguage' }] },
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  underscored: true,
})
export default class Locale
  extends BaseModel<LocaleAttributes, LocaleCreationAttributes>
  implements LocaleAttributes, Securable
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

  @BelongsTo(() => Language, {
    foreignKey: 'adminLanguageId',
    targetKey: 'code',
  })
  public adminLanguage?: Language;

  @BelongsTo(() => Language, {
    foreignKey: 'respondentLanguageId',
    targetKey: 'code',
  })
  public surveyLanguage?: Language;

  @BelongsTo(() => FoodIndexBackend, 'foodIndexLanguageBackendId')
  public foodIndexLanguageBackend?: FoodIndexBackend;

  @BelongsTo(() => Locale, {
    foreignKey: 'prototypeLocaleId',
    targetKey: 'code',
  })
  public parent?: Locale;

  @HasMany(() => Locale, {
    foreignKey: 'prototypeLocaleId',
    sourceKey: 'code',
  })
  public children?: Locale[];

  @HasMany(() => Survey, 'localeId')
  public surveys?: Survey[];

  @BelongsTo(() => User, 'ownerId')
  public owner?: User | null;

  @BelongsToMany(() => User, {
    through: {
      model: () => UserSecurable,
      unique: false,
      scope: {
        securable_type: 'Locale',
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
    scope: { securable_type: 'Locale' },
  })
  public securables?: UserSecurable[];
}
