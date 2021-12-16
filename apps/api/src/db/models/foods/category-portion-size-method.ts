import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { CategoryPortionSizeMethodParameter, Category, Locale } from '@api/db/models/foods';
import {
  PortionSizeMethodId,
  CategoryPortionSizeMethodAttributes,
  CategoryPortionSizeMethodCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';
import CategoryLocal from './category-local';

@Table({
  modelName: 'CategoryPortionSizeMethod',
  tableName: 'categories_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethod
  extends BaseModel<
    CategoryPortionSizeMethodAttributes,
    CategoryPortionSizeMethodCreationAttributes
  >
  implements CategoryPortionSizeMethodAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
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
    type: DataType.STRING(32),
  })
  public method!: PortionSizeMethodId;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public imageUrl!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public useForRecipes!: boolean;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17),
  })
  public conversionFactor!: number;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;

  @BelongsTo(() => CategoryLocal, 'categoryCode')
  public localCategory?: CategoryLocal;

  @HasMany(() => CategoryPortionSizeMethodParameter, 'portionSizeMethodId')
  public parameters?: CategoryPortionSizeMethodParameter[];
}
