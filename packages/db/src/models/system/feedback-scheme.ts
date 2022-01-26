import { Column, DataType, HasMany, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import {
  FeedbackSchemeAttributes,
  FeedbackSchemeCreationAttributes,
} from '@intake24/common/types/models';
import {
  defaultTopFoods,
  defaultHenryCoefficients,
  FeedbackType,
  FoodGroup,
  TopFoods,
  HenryCoefficient,
} from '@intake24/common/feedback';
import BaseModel from '../model';
import { Survey } from '.';

@Table({
  modelName: 'FeedbackScheme',
  tableName: 'feedback_schemes',
  freezeTableName: true,
  underscored: true,
})
export default class FeedbackScheme
  extends BaseModel<FeedbackSchemeAttributes, FeedbackSchemeCreationAttributes>
  implements FeedbackSchemeAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(256),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public type!: FeedbackType;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get topFoods(): TopFoods {
    const val = this.getDataValue('topFoods') as unknown;
    return val ? JSON.parse(val as string) : defaultTopFoods;
  }

  set topFoods(value: TopFoods) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('topFoods', JSON.stringify(value ?? defaultTopFoods));
  }

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get foodGroups(): FoodGroup[] {
    const val = this.getDataValue('foodGroups') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set foodGroups(value: FoodGroup[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('foodGroups', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get henryCoefficients(): HenryCoefficient[] {
    const val = this.getDataValue('henryCoefficients') as unknown;
    return val ? JSON.parse(val as string) : defaultHenryCoefficients;
  }

  set henryCoefficients(value: HenryCoefficient[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('henryCoefficients', JSON.stringify(value ?? defaultHenryCoefficients));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => Survey, 'feedbackSchemeId')
  public surveys?: Survey[];
}
