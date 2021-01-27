import { Column, DataType, HasMany, Table, BelongsTo } from 'sequelize-typescript';
import BaseModel from '../model';

@Table({
  modelName: 'Locale',
  tableName: 'locales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Locale extends BaseModel<Locale> {
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
    type: DataType.STRING,
  })
  public prototypeLocaleId!: string | null;

  @Column({
    allowNull: false,
    defaultValue: 'ltr',
  })
  public textDirection!: string;

  @BelongsTo(() => Locale, 'prototypeLocaleId')
  public parent?: Locale;

  @HasMany(() => Locale, 'prototypeLocaleId')
  public children?: Locale[];
}
