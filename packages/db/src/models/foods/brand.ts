import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';

import type { BrandAttributes, BrandCreationAttributes } from '@intake24/common/types/models';
import { Food, FoodsLocale } from '@intake24/db';

import BaseModel from '../model';

@Scopes(() => ({
  locale: { include: [{ model: FoodsLocale }] },
  food: { include: [{ model: Food }] },
}))
@Table({
  modelName: 'Brand',
  tableName: 'brands',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Brand
  extends BaseModel<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @ForeignKey(() => FoodsLocale)
  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public name!: string;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;
}
