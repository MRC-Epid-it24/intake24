import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { Scheme as SchemeAttributes, SchemeType } from '@common/types/models/system';
import { Meal } from '@common/types/meals';
import { RecallQuestions } from '@common/types/recall';
import BaseModel from '../model';
import Survey from './survey';

// TODO: move this to DB-managed list / localizations
export const defaultMeals: Meal[] = [
  { name: { en: 'Breakfast' }, time: '8:10' },
  { name: { en: 'Morning snack' }, time: '10:00' },
  { name: { en: 'Lunch' }, time: '13:00' },
  { name: { en: 'Afternoon snack' }, time: '16:00' },
  { name: { en: 'Dinner' }, time: '18:00' },
  { name: { en: 'Evening snack' }, time: '20:00' },
];

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'Scheme',
  tableName: 'schemes',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Scheme extends BaseModel<Scheme> implements SchemeAttributes {
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
   * Current workaround - double-cast and suppress ts-error
   * TODO: check if fixed later in TS or Sequelize
   *
   * */
  @Column({
    type: DataType.TEXT({ length: 'long' }),
  })
  get questions(): RecallQuestions {
    const val = this.getDataValue('questions') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set questions(value: RecallQuestions) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.setDataValue('questions', JSON.stringify(value ?? {}));
  }

  @Column({
    type: DataType.TEXT({ length: 'long' }),
  })
  get meals(): Meal[] {
    const val = this.getDataValue('meals') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set meals(value: Meal[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this.setDataValue('meals', JSON.stringify(value ?? []));
  }

  @HasMany(() => Survey, 'schemeId')
  public surveys?: Survey[];
}
