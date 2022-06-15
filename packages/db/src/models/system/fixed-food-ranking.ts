import { Column, DataType, Table } from 'sequelize-typescript';
import type { FixedFoodRankingAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'FixedFoodRanking',
  tableName: 'fixed_food_ranking',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FixedFoodRanking
  extends BaseModel<FixedFoodRankingAttributes>
  implements FixedFoodRankingAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.INTEGER,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public rank!: number;
}
