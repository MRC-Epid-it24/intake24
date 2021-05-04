import { Column, DataType, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { PromptQuestion } from '@common/types';
import { SchemeQuestionAttributes, SchemeQuestionCreationAttributes } from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'SchemeQuestion',
  tableName: 'scheme_questions',
  freezeTableName: true,
  underscored: true,
})
export default class SchemeQuestion
  extends BaseModel<SchemeQuestionAttributes, SchemeQuestionCreationAttributes>
  implements SchemeQuestionAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get prompt(): PromptQuestion {
    const val = this.getDataValue('prompt') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set prompt(value: PromptQuestion) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('prompt', JSON.stringify(value ?? {}));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
