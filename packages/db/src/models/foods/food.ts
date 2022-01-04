import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  HasMany,
  Scopes,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { FoodAttributes } from '@common/types/models';
import BaseModel from '../model';
import {
  AssociatedFood,
  FoodAttribute,
  FoodLocal,
  Brand,
  Category,
  FoodCategory,
  FoodGroup,
} from '.';

@Scopes(() => ({
  attributes: { include: [{ model: FoodAttribute }] },
  locals: { include: [{ model: FoodLocal }] },
  brand: { include: [{ model: Brand }] },
}))
@Table({
  modelName: 'Food',
  tableName: 'foods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Food extends BaseModel<FoodAttributes> implements FoodAttributes {
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
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodGroupId!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @HasOne(() => FoodAttribute, 'foodCode')
  public attributes?: FoodAttribute;

  @HasMany(() => AssociatedFood, 'foodCode')
  public associatedFoods?: AssociatedFood[];

  @HasMany(() => Brand, 'foodCode')
  public brands?: Brand[];

  @BelongsToMany(() => Category, () => FoodCategory)
  public parentCategories?: Category[];

  @HasMany(() => FoodCategory, 'foodCode')
  public parentCategoryMappings?: FoodCategory[];

  @HasMany(() => AssociatedFood, 'associatedFoodCode')
  public foodAssociations?: AssociatedFood[];

  @BelongsTo(() => FoodGroup, 'foodGroupId')
  public foodGroup?: FoodGroup;

  @HasMany(() => FoodLocal, 'foodCode')
  public locals?: FoodLocal[];
}
