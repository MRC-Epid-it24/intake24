import { Column, DataType, Table } from 'sequelize-typescript';
import { PopularityCounterAttributes } from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'PopularityCounter',
  tableName: 'popularity_counters',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PopularityCounter
  extends BaseModel<PopularityCounterAttributes>
  implements PopularityCounterAttributes
{
  @Column({
    allowNull: false,
    type: DataType.STRING(8),
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public counter!: number;
}
