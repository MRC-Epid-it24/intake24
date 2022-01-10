import { BelongsTo, Column, DataType, ForeignKey, Table, Scopes } from 'sequelize-typescript';
import { FoodsLocale, Food, Category } from '@intake24/db';
import {
  AssociatedFoodAttributes,
  AssociatedFoodCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';

@Scopes(() => ({
  locale: { include: [{ model: FoodsLocale }] },
  category: { include: [{ model: Category }] },
}))
@Table({
  modelName: 'AssociatedFood',
  tableName: 'associated_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AssociatedFood
  extends BaseModel<AssociatedFoodAttributes, AssociatedFoodCreationAttributes>
  implements AssociatedFoodAttributes
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

  @ForeignKey(() => Food)
  @Column({
    allowNull: true,
    type: DataType.STRING(8),
  })
  public associatedFoodCode!: string | null;

  @ForeignKey(() => Category)
  @Column({
    allowNull: true,
    type: DataType.STRING(8),
  })
  public associatedCategoryCode!: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  public text!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public linkAsMain!: boolean;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public genericName!: string;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;

  @BelongsTo(() => FoodsLocale, 'localeId')
  public locale?: FoodsLocale;

  @BelongsTo(() => Category, 'associatedCategoryCode')
  public associatedCategory?: Category;

  @BelongsTo(() => Food, 'associatedFoodCode')
  public associatedFood?: Food;
}
