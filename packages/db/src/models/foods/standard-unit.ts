import { Column, CreatedAt, DataType, HasMany, Table, UpdatedAt } from 'sequelize-typescript';

import type { RequiredLocaleTranslation } from '@intake24/common/types';
import type {
  StandardUnitAttributes,
  StandardUnitCreationAttributes,
} from '@intake24/common/types/models';

import { CategoryPortionSizeMethodParameter, FoodPortionSizeMethodParameter } from '..';
import BaseModel from '../model';

@Table({
  modelName: 'StandardUnit',
  tableName: 'standard_units',
  freezeTableName: true,
  timestamps: true,
  underscored: true,
})
export default class StandardUnit
  extends BaseModel<StandardUnitAttributes, StandardUnitCreationAttributes>
  implements StandardUnitAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get estimateIn(): RequiredLocaleTranslation {
    const val = this.getDataValue('estimateIn') as unknown;
    return val ? JSON.parse(val as string) : { en: 'Estimate in' };
  }

  set estimateIn(value: RequiredLocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('estimateIn', JSON.stringify(value ?? { en: 'Estimate in' }));
  }

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get howMany(): RequiredLocaleTranslation {
    const val = this.getDataValue('howMany') as unknown;
    return val ? JSON.parse(val as string) : { en: 'How many' };
  }

  set howMany(value: RequiredLocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('howMany', JSON.stringify(value ?? { en: 'How many' }));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => CategoryPortionSizeMethodParameter, {
    foreignKey: 'value',
    constraints: false,
  })
  public categoryPsmParameters?: CategoryPortionSizeMethodParameter[];

  @HasMany(() => FoodPortionSizeMethodParameter, {
    foreignKey: 'value',
    constraints: false,
  })
  public foodPsmParameters?: FoodPortionSizeMethodParameter[];
}
