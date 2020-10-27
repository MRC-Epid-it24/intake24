import { Table, Column, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { JobType } from '@/jobs/job';
import { Task as TaskAttributes } from '@common/types/models/system';
import BaseModel from '../model';

@Table({
  modelName: 'Task',
  tableName: 'tasks',
  freezeTableName: true,
  underscored: true,
})
export default class Task extends BaseModel<Task> implements TaskAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public job!: JobType;

  @Column({
    allowNull: false,
    defaultValue: '0 * * * *',
  })
  public cron!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public active!: boolean;

  @Column
  public description!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
