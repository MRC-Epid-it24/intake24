import { Column, HasMany, Scopes, Table, BelongsTo } from 'sequelize-typescript';
import { Locale as LocaleAttributes } from '@common/types/models/system';
import BaseModel from '../model';
import Survey from './survey';

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Locale extends BaseModel<Locale> implements LocaleAttributes {
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
  public respondentLanguageId!: string;

  @Column({
    allowNull: false,
  })
  public adminLanguageId!: string;

  @Column({
    allowNull: false,
  })
  public countryFlagCode!: string;

  @Column({
    allowNull: true,
  })
  public prototypeLocaleId!: string;

  @Column({
    allowNull: false,
    defaultValue: 'ltr',
  })
  public textDirection!: string;

  @BelongsTo(() => Locale, 'prototypeLocaleId')
  public parent?: Locale;

  @HasMany(() => Locale, 'prototypeLocaleId')
  public children?: Locale[];

  @HasMany(() => Survey, 'localeId')
  public surveys?: Survey[];
}
