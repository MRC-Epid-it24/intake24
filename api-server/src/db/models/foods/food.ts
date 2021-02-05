import { Column, DataType, HasOne, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { AssociatedFood, FoodAttribute, FoodLocal, Brand } from '.';

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
export default class Food extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public code!: string;

  @Column({
    allowNull: false,
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

  @HasMany(() => FoodLocal, 'foodCode')
  public localFoods?: FoodLocal[];

  @HasMany(() => AssociatedFood, 'foodCode')
  public foodAssociations?: AssociatedFood[];

  @HasMany(() => Brand, 'foodCode')
  public brand?: Brand[];
}
