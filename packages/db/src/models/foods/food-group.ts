import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import type {
  FoodGroupAttributes,
  FoodGroupCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { Food, FoodGroupLocal } from '.';

@Table({
  modelName: 'FoodGroup',
  tableName: 'food_groups',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodGroup
  extends BaseModel<FoodGroupAttributes, FoodGroupCreationAttributes>
  implements FoodGroupAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public name!: string;

  @HasMany(() => FoodGroupLocal, 'foodGroupId')
  public localGroups?: FoodGroupLocal[];

  @HasMany(() => Food, 'foodGroupId')
  public foods?: Food[];
}
