import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { CategoryLocalAttributes } from '@common/types/models';
import { Category, CategoryPortionSizeMethod, Locale } from '@api/db/models/foods';
import BaseModel from '../model';

@Table({
  modelName: 'CategoryLocal',
  tableName: 'categories_local',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryLocal
  extends BaseModel<CategoryLocalAttributes>
  implements CategoryLocalAttributes
{
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
    allowNull: true,
    type: DataType.STRING(128),
  })
  public localDescription!: string | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(128),
  })
  public simpleLocalDescription!: string | null;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @HasMany(() => CategoryPortionSizeMethod, 'categoryCode')
  public portionSizeMethods?: CategoryPortionSizeMethod[];
}
