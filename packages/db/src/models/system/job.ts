import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { JobType, JobTypeParams } from '@intake24/common/types';
import type { JobAttributes, JobCreationAttributes } from '@intake24/common/types/models';

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
  public id!: string;

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
  public userId!: string | null;

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
    type: DataType.STRING(1024),
  })
  public message!: string | null;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get params(): JobTypeParams {
    const val = this.getDataValue('params') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set params(value: JobTypeParams) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('params', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get stackTrace(): string[] | null {
    const val = this.getDataValue('stackTrace') as unknown;
    return val ? (val as string).split('\n') : null;
  }

  set stackTrace(value: string[] | null) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('stackTrace', value.join('\n'));
  }

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

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
