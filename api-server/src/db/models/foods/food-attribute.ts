import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Food from './food';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class FoodAttribute extends BaseModel<FoodAttribute> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    primaryKey: true,
  })
  public foodCode!: string;

  @Column
  public sameAsBeforeOption!: boolean;

  @Column
  public readyMealOption!: boolean;

  @Column
  public reasonableAmount!: number;

  @Column
  public useInRecipes!: number;

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;
}
