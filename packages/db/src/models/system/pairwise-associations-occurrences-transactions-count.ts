import { Column, DataType, Table } from 'sequelize-typescript';
import type { PAOccurrenceTransactionCountAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'PAOccurrenceTransactionCount',
  tableName: 'pairwise_associations_transactions_count',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PAOccurrenceTransactionCount
  extends BaseModel<PAOccurrenceTransactionCountAttributes>
  implements PAOccurrenceTransactionCountAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public transactionsCount!: number;
}
