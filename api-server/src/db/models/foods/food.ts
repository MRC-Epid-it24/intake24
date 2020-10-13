import { Column, DataType, HasOne, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { FoodAttribute, FoodLocal } from '.';

@Scopes(() => ({
  attributes: { include: [{ model: FoodAttribute }] },
  localFoods: { include: [{ model: FoodLocal }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class Food extends BaseModel<Food> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public code!: string;

  @Column
  public description!: string;

  @Column
  public foodGroupId!: number;

  @Column({
    type: DataType.UUID,
  })
  public version!: string;

  @HasOne(() => FoodAttribute, 'foodCode')
  public attributes?: FoodAttribute[];

  @HasMany(() => FoodLocal, 'foodCode')
  public localFoods?: FoodLocal[];
}
