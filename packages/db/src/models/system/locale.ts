/* eslint-disable no-use-before-define */
import {
  AfterCreate,
  AfterDestroy,
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { LocaleAttributes, LocaleCreationAttributes } from '@common/types/models';
import { foodDatabasePermissions } from '@api/services';
import BaseModel from '../model';
import { Language, Permission, Survey } from '.';

@Scopes(() => ({
  list: { attributes: ['id', 'englishName', 'localName', 'countryFlagCode'] },
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

  @AfterCreate
  static async createLocalePermissions(instance: Locale): Promise<void> {
    const permissions = foodDatabasePermissions(instance.id).map((item) => ({
      name: item,
      displayName: item,
      description: `Food database specific permission (${item})`,
    }));

    await Permission.bulkCreate(permissions);
  }

  @AfterDestroy
  static async destroyLocalePermissions(instance: Locale): Promise<void> {
    await Permission.destroy({ where: { name: foodDatabasePermissions(instance.id) } });
  }

  // TODO: add BulkAfterCreate & BulkAfterDestroy if/when implemented in system
}
