import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { Dictionary } from '@intake24/common/types';

import BaseModel from '../model';
import { Survey, User } from '.';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'ClientErrorReport',
  tableName: 'client_error_reports',
  freezeTableName: true,
  underscored: true,
})
export default class ClientErrorReport extends BaseModel<
  InferAttributes<ClientErrorReport>,
  InferCreationAttributes<ClientErrorReport>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  declare userId: string | null;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Survey)
  declare surveyId: string | null;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get stackTrace(): string[] {
    return (this.getDataValue('stackTrace') as unknown as string).split('\n');
  }

  set stackTrace(value: string[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('stackTrace', value.join('\n'));
  }

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get surveyStateJson(): Dictionary {
    const val = this.getDataValue('surveyStateJson') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set surveyStateJson(value: Dictionary) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('surveyStateJson', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare new: boolean;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>;

  @BelongsTo(() => Survey, 'surveyId')
  declare survey?: NonAttribute<Survey>;
}

export type ClientErrorReportAttributes = Attributes<ClientErrorReport>;
export type ClientErrorReportCreationAttributes = CreationAttributes<ClientErrorReport>;
