import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import type {
  ClientErrorReportAttributes,
  ClientErrorReportCreationAttributes,
} from '@intake24/common/types/models';
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
export default class ClientErrorReport
  extends BaseModel<ClientErrorReportAttributes, ClientErrorReportCreationAttributes>
  implements ClientErrorReportAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  public userId!: string | null;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Survey)
  public surveyId!: string | null;

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
    defaultValue: true,
  })
  public new!: boolean;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
