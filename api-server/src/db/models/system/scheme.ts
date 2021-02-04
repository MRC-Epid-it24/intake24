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
import { Scheme as SchemeAttributes, SchemeType, ExportScheme } from '@common/types/models';
import BaseModel from '../model';
import { Survey } from '.';

// TODO: move this to DB-managed list / localizations
export const defaultMeals: Meal[] = [
  { name: { en: 'Breakfast' }, time: '8:00' },
  { name: { en: 'Morning snack' }, time: '10:00' },
  { name: { en: 'Lunch' }, time: '13:00' },
  { name: { en: 'Afternoon snack' }, time: '16:00' },
  { name: { en: 'Dinner' }, time: '18:00' },
  { name: { en: 'Evening snack' }, time: '20:00' },
];

export const defaultExport: ExportScheme = [
  { id: 'survey', fields: [] },
  { id: 'surveyCustom', fields: [] },
  { id: 'meal', fields: [] },
  { id: 'mealCustom', fields: [] },
  { id: 'food', fields: [] },
  { id: 'foodCustom', fields: [] },
  { id: 'foodFields', fields: [] },
  { id: 'foodNutrients', fields: [] },
  { id: 'portionSizes', fields: [] },
];

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Scheme',
  tableName: 'schemes',
  freezeTableName: true,
  underscored: true,
})
export default class Scheme extends BaseModel implements SchemeAttributes {
  @Column({
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
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
    return val ? JSON.parse(val as string) : {};
  }

  set questions(value: RecallQuestions) {
    this.setDataValue('questions', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get meals(): Meal[] {
    const val = this.getDataValue('meals') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set meals(value: Meal[]) {
    this.setDataValue('meals', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get export(): ExportScheme {
    const val = this.getDataValue('export') as unknown;
    return val ? JSON.parse(val as string) : defaultExport;
  }

  set export(value: ExportScheme) {
    this.setDataValue('export', JSON.stringify(value ?? []));
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
