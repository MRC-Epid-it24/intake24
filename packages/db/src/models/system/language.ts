import {
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { LanguageAttributes, LanguageCreationAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import Locale from './locale';
import LanguageTranslation from './language-translation';

@Scopes(() => ({
  public: { attributes: ['id', 'englishName', 'localName', 'countryFlagCode', 'textDirection'] },
  list: { attributes: ['id', 'englishName', 'localName', 'countryFlagCode'] },
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
  implements LanguageAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(16),
  })
  public id!: string;

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
  public textDirection!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => LanguageTranslation, 'languageId')
  public translations?: LanguageTranslation[];

  @HasMany(() => Locale, 'adminLanguageId')
  public adminLocales?: Locale[];

  @HasMany(() => Locale, 'respondentLanguageId')
  public surveyLocales?: Locale[];
}
