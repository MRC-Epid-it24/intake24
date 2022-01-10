import { Column, DataType, Table, CreatedAt, UpdatedAt, BelongsTo } from 'sequelize-typescript';
import { LocaleMessages } from '@intake24/i18n';
import {
  LanguageMessageAttributes,
  LanguageMessageCreationAttributes,
} from '@intake24/common/types/models';
import { Application } from '@intake24/common/types';
import BaseModel from '../model';
import { Language } from '.';

@Table({
  modelName: 'LanguageMessage',
  tableName: 'language_messages',
  freezeTableName: true,
  underscored: true,
})
export default class LanguageMessage
  extends BaseModel<LanguageMessageAttributes, LanguageMessageCreationAttributes>
  implements LanguageMessageAttributes
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
  })
  public languageId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public application!: Application;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public section!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get messages(): LocaleMessages {
    const val = this.getDataValue('messages') as unknown;
    return JSON.parse(val as string);
  }

  set messages(value: LocaleMessages) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('messages', JSON.stringify(value));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => Language, 'languageId')
  public language?: Language[];
}
