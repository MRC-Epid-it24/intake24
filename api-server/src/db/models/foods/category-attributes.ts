import { Column, DataType, Table, Scopes, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from '@api-server/db/models/foods';
import {
  CategoryAttributeAttributes,
  CategoryAttributeCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';

@Scopes(() => ({
  category: { include: [{ model: Category }] },
}))
@Table({
  modelName: 'CategoryAttribute',
  tableName: 'categories_attributes',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryAttribute
  extends BaseModel<CategoryAttributeAttributes, CategoryAttributeCreationAttributes>
  implements CategoryAttributeAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public id!: number;

  @ForeignKey(() => Category)
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public categoryCode!: string;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  public sameAsBeforeOption!: boolean | null;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  public readyMealOption!: boolean | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public reasonableAmount!: number | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public useInRecipes!: number | null;

  @BelongsTo(() => Category, 'categoryCode')
  public category?: Category;
}
