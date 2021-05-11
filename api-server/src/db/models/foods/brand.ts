import { BelongsTo, Column, DataType, ForeignKey, Table, Scopes } from 'sequelize-typescript';
import { Locale, Food } from '@api-server/db/models/foods';
import { BrandAttributes, BrandCreationAttributes } from '@common/types/models';
import BaseModel from '@api-server/db/models/model';

@Scopes(() => ({
  locale: { include: [{ model: Locale }] },
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
    type: DataType.INTEGER,
  })
  public id!: number;

  @ForeignKey(() => Food)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @ForeignKey(() => Locale)
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

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;
}
