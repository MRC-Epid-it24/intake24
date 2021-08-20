import { Table, Column, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { JobParams, JobType } from '@common/types';
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
  public id!: string;

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

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get params(): JobParams {
    const val = this.getDataValue('params') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set params(value: JobParams) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('params', JSON.stringify(value ?? {}));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
