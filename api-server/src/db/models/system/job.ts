import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  UpdatedAt,
  Table,
} from 'sequelize-typescript';
import { JobType } from '@common/types';
import { JobAttributes, JobCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'Job',
  tableName: 'jobs',
  freezeTableName: true,
  underscored: true,
})
export default class Job
  extends BaseModel<JobAttributes, JobCreationAttributes>
  implements JobAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
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
    type: DataType.STRING(1024),
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
    type: DataType.STRING(512),
  })
  public message!: string | null;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  public stackTrace!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
