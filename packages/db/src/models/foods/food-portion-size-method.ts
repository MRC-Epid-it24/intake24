import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type { PortionSizeMethodId, PortionSizeParameter } from '@intake24/common/surveys';
import { FoodLocal } from '@intake24/db';

import BaseModel from '../model';

@Table({
  modelName: 'FoodPortionSizeMethod',
  tableName: 'food_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodPortionSizeMethod extends BaseModel<
  InferAttributes<FoodPortionSizeMethod>,
  InferCreationAttributes<FoodPortionSizeMethod>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare foodLocalId: ForeignKey<FoodLocal['id']>;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare method: PortionSizeMethodId;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare useForRecipes: boolean;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17),
  })
  declare conversionFactor: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare orderBy: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get parameters(): PortionSizeParameter {
    const val = this.getDataValue('parameters') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set parameters(value: PortionSizeParameter) {
    this.setDataValue('parameters', JSON.stringify(value ?? {}));
  }

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  declare foodLocal?: NonAttribute<FoodLocal>;
}

export type FoodPortionSizeMethodAttributes = Attributes<FoodPortionSizeMethod>;
export type FoodPortionSizeMethodCreationAttributes = CreationAttributes<FoodPortionSizeMethod>;
