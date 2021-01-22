import { BelongsTo, Column, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import { LocalField as LocalFieldAttributes } from '@common/types/models';
import BaseModel from '../model';
import { Locale } from '.';

@Scopes(() => ({
  locale: { include: [{ model: Locale }] },
}))
@Table({
  modelName: 'LocalField',
  tableName: 'local_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class LocalField extends BaseModel<LocalField> implements LocalFieldAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => Locale)
  public localeId!: string;

  @Column({
    allowNull: false,
  })
  public fieldName!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;
}
