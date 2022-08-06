import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type {
  GenUserCounterAttributes,
  GenUserCounterCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { Survey } from '.';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'GenUserCounter',
  tableName: 'gen_user_counters',
  freezeTableName: true,
  underscored: true,
})
export default class GenUserCounter
  extends BaseModel<GenUserCounterAttributes, GenUserCounterCreationAttributes>
  implements GenUserCounterAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  public count!: number;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
