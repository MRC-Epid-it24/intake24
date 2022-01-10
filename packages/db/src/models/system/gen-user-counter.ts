import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { GenUserCounterAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import { Survey } from '.';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'GenUserCounter',
  tableName: 'gen_user_counters',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GenUserCounter
  extends BaseModel<GenUserCounterAttributes>
  implements GenUserCounterAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  public count!: number;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
