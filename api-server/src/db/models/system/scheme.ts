import {
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Meal, RecallQuestions } from '@common/types';
import {
  SchemeAttributes,
  SchemeCreationAttributes,
  SchemeType,
  ExportSection,
} from '@common/types/models';
import { defaultExport, defaultMeals, defaultQuestions } from '@common/schemes';
import BaseModel from '../model';
import { Survey } from '.';

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Scheme',
  tableName: 'schemes',
  freezeTableName: true,
  underscored: true,
})
export default class Scheme
  extends BaseModel<SchemeAttributes, SchemeCreationAttributes>
  implements SchemeAttributes {
  @Column({
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public type!: SchemeType;

  /*
   * Sequelize and TypeScript don't play nice together when using
   * setters/getters with different types
   *
   * Current workaround - double-cast
   * TODO: check if fixed later in TS or Sequelize
   *
   * */
  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get questions(): RecallQuestions {
    const val = this.getDataValue('questions') as unknown;
    return val ? JSON.parse(val as string) : defaultQuestions;
  }

  set questions(value: RecallQuestions) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('questions', JSON.stringify(value ?? defaultQuestions));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get meals(): Meal[] {
    const val = this.getDataValue('meals') as unknown;
    return val ? JSON.parse(val as string) : defaultMeals;
  }

  set meals(value: Meal[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('meals', JSON.stringify(value ?? defaultMeals));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get export(): ExportSection[] {
    const val = this.getDataValue('export') as unknown;
    return val ? JSON.parse(val as string) : defaultExport;
  }

  set export(value: ExportSection[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('export', JSON.stringify(value ?? defaultExport));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => Survey, 'schemeId')
  public surveys?: Survey[];
}
