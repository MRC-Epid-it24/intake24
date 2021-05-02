import { BelongsToMany, Column, DataType, Table } from 'sequelize-typescript';
import { CategoryAttributes, CategoryCreationAttributes } from '@common/types/models';
import { Food, FoodCategory } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'Category',
  tableName: 'categories',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Category
  extends BaseModel<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(8),
  })
  public code!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public description!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public isHidden!: boolean;

  @Column({
    type: DataType.UUID,
  })
  public version!: string;

  @BelongsToMany(() => Food, () => FoodCategory)
  public foods?: Food[];
}
