import { BelongsTo, Column, DataType, ForeignKey, Table, Scopes } from 'sequelize-typescript';
import { Locale, Food, Category } from '@api/db/models/foods';
import BaseModel from '@api/db/models/model';

@Scopes(() => ({
  locale: { include: [{ model: Locale }] },
  category: { include: [{ model: Category }] },
}))
@Table({
  modelName: 'AssociatedFood',
  tableName: 'associated_foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AssociatedFood extends BaseModel {
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

  @ForeignKey(() => Locale)
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

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @BelongsTo(() => Category, 'associatedCategoryCode')
  public associatedCategory?: Category;

  @BelongsTo(() => Food, 'associatedFoodCode')
  public associatedFood?: Food;
}
