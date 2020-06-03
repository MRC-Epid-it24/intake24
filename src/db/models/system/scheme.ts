import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';

export enum SchemeTypes {
  LEGACY = 'legacy',
  DATA_DRIVEN = 'data-driven',
}

export type SchemeType = SchemeTypes;

export type Meal = { name: string; time: string };

// TODO: define Questions type / interface
export type Dictionary = { [key: string]: any };
export type Questions = Dictionary;

// TODO: move this to DB-managed list / localisations
export const defaultMeals: Meal[] = [
  { name: 'Breakfast', time: '8:10' },
  { name: 'Morning snack', time: '10:00' },
  { name: 'Lunch', time: '13:00' },
  { name: 'Afternoon snack', time: '16:00' },
  { name: 'Dinner', time: '18:00' },
  { name: 'Evening snack', time: '20:00' },
];

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class Scheme extends BaseModel<Scheme> {
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
  get questions(): Questions {
    const val = this.getDataValue('questions') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set questions(value: Questions) {
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
