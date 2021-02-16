import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import CategoryPortionSizeMethodParameter from '@api-server/db/models/foods/category-portion-size-method-param';
import BaseModel from '../model';
import { Category, Locale } from '.';

@Table({
  modelName: 'CategoryPortionSizeMethod',
  tableName: 'categories_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethod extends BaseModel {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @ForeignKey(() => Locale)
  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32)
  })
  public method!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128)
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512)
  })
  public imageUrl!: string;

  @Column({
    allowNull: false,
  })
  public useForRecipes!: boolean;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17)
  })
  public conversionFactor!: number;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;

  @HasMany(() => CategoryPortionSizeMethodParameter, 'portionSizeMethodId')
  public parameters!: CategoryPortionSizeMethodParameter[];
}
