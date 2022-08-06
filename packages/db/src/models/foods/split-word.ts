import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type {
  SplitWordAttributes,
  SplitWordCreationAttributes,
} from '@intake24/common/types/models/foods';

import BaseModel from '../model';
import { FoodsLocale } from '.';

@Table({
  modelName: 'SplitWord',
  tableName: 'split_words',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SplitWord
  extends BaseModel<SplitWordAttributes, SplitWordCreationAttributes>
  implements SplitWordAttributes
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
    type: DataType.TEXT({ length: 'long' }),
  })
  public words!: string;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;
}
