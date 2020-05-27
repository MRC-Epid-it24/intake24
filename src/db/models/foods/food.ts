import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import FoodAttribute from './food-attribute';

@Scopes(() => ({
  attribues: { include: [{ model: FoodAttribute }] },
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

  @HasMany(() => FoodAttribute, 'foodCode')
  public attribues?: FoodAttribute[];
}
