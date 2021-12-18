import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { CategoryLocalAttributes, CategoryLocalCreationAttributes } from '@common/types/models';
import { Category, CategoryPortionSizeMethod, Locale } from '@api/db/models/foods';
import BaseModel from '../model';

@Table({
  modelName: 'CategoryLocal',
  tableName: 'category_locals',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryLocal
  extends BaseModel<CategoryLocalAttributes, CategoryLocalCreationAttributes>
  implements CategoryLocalAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public simpleName!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @HasMany(() => CategoryPortionSizeMethod, 'categoryLocalId')
  public portionSizeMethods?: CategoryPortionSizeMethod[];
}
