import {
  BelongsToMany,
  Column,
  DataType,
  HasOne,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { FoodAttributes } from '@common/types/models';
import BaseModel from '../model';
import { AssociatedFood, FoodAttribute, FoodLocal, Brand, Category, FoodCategory } from '.';

@Scopes(() => ({
  attributes: { include: [{ model: FoodAttribute }] },
  localFoods: { include: [{ model: FoodLocal }] },
  brand: { include: [{ model: Brand }] },
  foodAssociations: { include: [{ model: AssociatedFood }] },
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
  public description!: string;

  @Column({
    allowNull: false,
  })
  public foodGroupId!: number;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public version!: string;

  @HasOne(() => FoodAttribute, 'foodCode')
  public attributes?: FoodAttribute[];

  @HasMany(() => Brand, 'foodCode')
  public brand?: Brand[];

  @BelongsToMany(() => Category, () => FoodCategory)
  public categories?: Category[];

  @HasMany(() => FoodCategory, 'foodCode')
  public categoryLinks?: FoodCategory[];

  @HasMany(() => AssociatedFood, 'foodCode')
  public foodAssociations?: AssociatedFood[];

  @HasMany(() => FoodLocal, 'foodCode')
  public localFoods?: FoodLocal[];
}
