import { BelongsTo, Column, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';

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
export default class GenUserCounter extends BaseModel<GenUserCounter> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
    defaultValue: 0,
  })
  public count!: number;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
