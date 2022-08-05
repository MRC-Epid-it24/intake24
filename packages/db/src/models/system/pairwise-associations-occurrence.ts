import { Column, DataType, Table } from 'sequelize-typescript';
import type { PAOccurrenceAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'PAOccurrence',
  tableName: 'pairwise_associations_occurrences',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class PAOccurrence
  extends BaseModel<PAOccurrenceAttributes>
  implements PAOccurrenceAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public localeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(50),
  })
  public foodCode!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public occurrences!: number;
}
