import { BelongsTo, Column, DataType, ForeignKey, Table, Scopes } from 'sequelize-typescript';
import { FoodsLocale, Food } from '@api/db';
import { BrandAttributes, BrandCreationAttributes } from '@common/types/models';
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
