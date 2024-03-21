import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { RequiredLocaleTranslation } from '@intake24/common/types';

import BaseModel from '../model';

@Table({
  modelName: 'StandardUnit',
  tableName: 'standard_units',
  freezeTableName: true,
  timestamps: true,
  underscored: true,
})
export default class StandardUnit extends BaseModel<
  InferAttributes<StandardUnit>,
  InferCreationAttributes<StandardUnit>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(64),
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare name: string;

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
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;
}

export type StandardUnitAttributes = Attributes<StandardUnit>;
export type StandardUnitCreationAttributes = CreationAttributes<StandardUnit>;
