import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type {
  Card,
  DemographicGroup,
  FeedbackOutput,
  FeedbackPhysicalDataField,
  FeedbackType,
  HenryCoefficient,
  TopFoods,
} from '@intake24/common/feedback';
import type {
  FeedbackSchemeAttributes,
  FeedbackSchemeCreationAttributes,
} from '@intake24/common/types/models';
import { defaultTopFoods } from '@intake24/common/feedback';

import type { Securable } from '..';
import { BaseModel } from '..';
import { Survey, User, UserSecurable } from '.';

@Scopes(() => ({
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'FeedbackScheme',
  tableName: 'feedback_schemes',
  freezeTableName: true,
  underscored: true,
})
export default class FeedbackScheme
  extends BaseModel<FeedbackSchemeAttributes, FeedbackSchemeCreationAttributes>
  implements FeedbackSchemeAttributes, Securable
{
  @Column({
    autoIncrement: true,
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
    defaultValue: 'default',
    type: DataType.STRING(64),
  })
  public type!: FeedbackType;

  @Column({
    allowNull: true,
    defaultValue: () => JSON.stringify([]),
    type: DataType.TEXT,
  })
  get outputs(): FeedbackOutput[] {
    const val = this.getDataValue('outputs') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set outputs(value: FeedbackOutput[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('outputs', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: true,
    defaultValue: JSON.stringify([]),
    type: DataType.TEXT,
  })
  get physicalDataFields(): FeedbackPhysicalDataField[] {
    const val = this.getDataValue('physicalDataFields') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set physicalDataFields(value: FeedbackPhysicalDataField[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('physicalDataFields', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: false,
    defaultValue: () => JSON.stringify(defaultTopFoods),
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
    defaultValue: JSON.stringify([]),
    type: DataType.TEXT({ length: 'long' }),
  })
  get cards(): Card[] {
    const val = this.getDataValue('cards') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set cards(value: Card[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('cards', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: false,
    defaultValue: JSON.stringify([]),
    type: DataType.TEXT({ length: 'long' }),
  })
  get demographicGroups(): DemographicGroup[] {
    const val = this.getDataValue('demographicGroups') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set demographicGroups(value: DemographicGroup[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('demographicGroups', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: false,
    defaultValue: JSON.stringify([]),
    type: DataType.TEXT({ length: 'long' }),
  })
  get henryCoefficients(): HenryCoefficient[] {
    const val = this.getDataValue('henryCoefficients') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set henryCoefficients(value: HenryCoefficient[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('henryCoefficients', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public ownerId!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'ownerId')
  public owner?: User | null;

  @HasMany(() => Survey, 'feedbackSchemeId')
  public surveys?: Survey[];

  @BelongsToMany(() => User, {
    through: {
      model: () => UserSecurable,
      unique: false,
      scope: {
        securable_type: 'FeedbackScheme',
      },
    },
    foreignKey: 'securableId',
    otherKey: 'userId',
    constraints: false,
  })
  public securableUsers?: User[];

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'FeedbackScheme' },
  })
  public securables?: UserSecurable[];
}
