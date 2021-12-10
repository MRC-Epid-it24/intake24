import { Column, DataType, Table } from 'sequelize-typescript';
import { PACoOccurrenceAttributes } from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'PACoOccurrence',
  tableName: 'pairwise_associations_co_occurrences',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PACoOccurrence
  extends BaseModel<PACoOccurrenceAttributes>
  implements PACoOccurrenceAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public locale!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(50),
  })
  public antecedentFoodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(50),
  })
  public consequentFoodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public occurrences!: number;
}
