import { Table, Column, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { JobType } from '@api-server/jobs';
import { TaskAttributes, TaskCreationAttributes } from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'Task',
  tableName: 'tasks',
  freezeTableName: true,
  underscored: true,
})
export default class Task
  extends BaseModel<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public job!: JobType;

  @Column({
    allowNull: false,
    defaultValue: '0 * * * *',
    type: DataType.STRING(16),
  })
  public cron!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public active!: boolean;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  public description!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
