import { Column, DataType, HasMany, Scopes, Table, BelongsTo } from 'sequelize-typescript';
import { LocaleAttributes, LocaleCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { Language, Survey } from '.';

@Scopes(() => ({
  adminLanguage: { include: [{ model: Language, as: 'adminLanguage' }] },
  surveyLanguage: { include: [{ model: Language, as: 'surveyLanguage' }] },
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Locale
  extends BaseModel<LocaleAttributes, LocaleCreationAttributes>
  implements LocaleAttributes
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

  @BelongsTo(() => Language, 'respondentLanguageId')
  public surveyLanguage?: Language;

  @BelongsTo(() => Language, 'adminLanguageId')
  public adminLanguage?: Language;

  @BelongsTo(() => Locale, 'prototypeLocaleId')
  public parent?: Locale;

  @HasMany(() => Locale, 'prototypeLocaleId')
  public children?: Locale[];

  @HasMany(() => Survey, 'localeId')
  public surveys?: Survey[];
}
