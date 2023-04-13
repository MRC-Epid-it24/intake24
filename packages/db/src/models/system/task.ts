import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { JobType, JobTypeParams } from '@intake24/common/types';

import BaseModel from '../model';

@Table({
  modelName: 'Task',
  tableName: 'tasks',
  freezeTableName: true,
  underscored: true,
})
export default class Task extends BaseModel<InferAttributes<Task>, InferCreationAttributes<Task>> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare job: JobType;

  @Column({
    allowNull: false,
    defaultValue: '0 * * * *',
    type: DataType.STRING(16),
  })
  declare cron: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare active: CreationOptional<boolean>;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  declare description: CreationOptional<string | null>;

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

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;
}

export type TaskAttributes = Attributes<Task>;
export type TaskCreationAttributes = CreationAttributes<Task>;
