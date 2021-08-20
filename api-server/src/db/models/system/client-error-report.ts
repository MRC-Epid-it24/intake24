import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import {
  ClientErrorReportAttributes,
  ClientErrorReportCreationAttributes,
} from '@common/types/models';
import { Dictionary } from '@common/types';
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
  timestamps: false,
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
    type: DataType.STRING(64),
  })
  @ForeignKey(() => Survey)
  public surveyId!: string | null;

  @Column({
    allowNull: false,
  })
  public reportedAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get stackTrace(): string[] {
    return (this.getDataValue('stackTrace') as unknown as string).split('\n');
  }

  set stackTrace(value: string[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('surveyStateJson', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: false,
    defaultValue: true,
  })
  public new!: boolean;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey;
}
