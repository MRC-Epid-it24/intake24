import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { FoodAttributeAttributes, FoodAttributeCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import Food from './food';

@Scopes(() => ({
  food: { include: [{ model: Food }] },
}))
@Table({
  modelName: 'FoodAttribute',
  tableName: 'foods_attributes',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodAttribute
  extends BaseModel<FoodAttributeAttributes, FoodAttributeCreationAttributes>
  implements FoodAttributeAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

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

  @BelongsTo(() => Food, 'foodCode')
  public food?: Food;
}
