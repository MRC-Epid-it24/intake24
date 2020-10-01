import { Column, HasMany, Scopes, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { Language as LanguageAttributes } from '@common/types/models/system';
import BaseModel from '../model';
import { Locale } from '.';

@Scopes(() => ({
  adminLocales: { include: [{ model: Locale, as: 'adminLocales' }] },
  surveyLocales: { include: [{ model: Locale, as: 'surveyLocales' }] },
}))
@Table({
  modelName: 'Language',
  tableName: 'languages',
  freezeTableName: true,
  underscored: true,
})
export default class Language extends BaseModel<Language> implements LanguageAttributes {
  @Column({
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public englishName!: string;

  @Column({
    allowNull: false,
  })
  public localName!: string;

  @Column({
    allowNull: false,
  })
  public countryFlagCode!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => Locale, 'adminLanguageId')
  public adminLocales?: Locale[];

  @HasMany(() => Locale, 'respondentLanguageId')
  public surveyLocales?: Locale[];
}
