import { Table, Column, CreatedAt, DataType, ForeignKey, UpdatedAt } from 'sequelize-typescript';
import { JobType } from '@api-server/jobs/job';
import { Job as JobAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'Job',
  tableName: 'jobs',
  freezeTableName: true,
  underscored: true,
})
export default class Job extends BaseModel implements JobAttributes {
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
    type: DataType.DATE,
  })
  public startedAt!: Date | null;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  public completedAt!: Date | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public downloadUrl!: string | null;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  public downloadUrlExpiresAt!: Date | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public progress!: number | null;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  public successful!: boolean | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public message!: string | null;

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
