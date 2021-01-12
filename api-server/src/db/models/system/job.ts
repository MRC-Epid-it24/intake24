import { Table, Column, CreatedAt, DataType, ForeignKey, UpdatedAt } from 'sequelize-typescript';
import { JobType } from '@api-server/jobs/job';
import { Job as JobAttributes } from '@common/types/models/system';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'Job',
  // TODO rename appropriately once all tasks / jobs is implemented / consolidated
  tableName: 'tools_tasks',
  freezeTableName: true,
  underscored: true,
})
export default class Job extends BaseModel<Job> implements JobAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public type!: JobType;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: number | null;

  @Column({
    allowNull: true,
  })
  public startedAt!: Date;

  @Column({
    allowNull: true,
  })
  public completedAt!: Date;

  @Column({
    allowNull: true,
  })
  public downloadUrl!: string;

  @Column({
    allowNull: true,
  })
  public downloadUrlExpiresAt!: Date;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public progress!: number;

  @Column({
    allowNull: true,
  })
  public successful!: boolean;

  @Column({
    allowNull: true,
  })
  public message!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  public stackTrace!: string;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
