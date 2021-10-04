import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { SplitListAttributes, SplitListCreationAttributes } from '@common/types/models/foods';
import BaseModel from '../model';
import { Locale } from '.';

@Table({
  modelName: 'SplitList',
  tableName: 'split_lists',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SplitList
  extends BaseModel<SplitListAttributes, SplitListCreationAttributes>
  implements SplitListAttributes
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
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public firstWord!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  public words!: string;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;
}
