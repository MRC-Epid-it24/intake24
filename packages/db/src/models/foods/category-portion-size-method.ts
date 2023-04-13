import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';

import type { PortionSizeMethodId } from '@intake24/common/types';
import type { CategoryPortionSizeMethodParameterCreationAttributes } from '@intake24/db';
import { CategoryPortionSizeMethodParameter } from '@intake24/db';

import BaseModel from '../model';
import CategoryLocal from './category-local';

@Table({
  modelName: 'CategoryPortionSizeMethod',
  tableName: 'category_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethod extends BaseModel<
  InferAttributes<CategoryPortionSizeMethod>,
  InferCreationAttributes<CategoryPortionSizeMethod> & {
    parameters?: CategoryPortionSizeMethodParameterCreationAttributes[];
  }
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
  declare categoryLocalId: ForeignKey<CategoryLocal['id']>;

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
    type: DataType.STRING(512),
  })
  declare imageUrl: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  declare useForRecipes: boolean;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare orderBy: string;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17),
  })
  declare conversionFactor: number;

  @BelongsTo(() => CategoryLocal, 'categoryLocalId')
  declare categoryLocal?: NonAttribute<CategoryLocal>;

  @HasMany(() => CategoryPortionSizeMethodParameter, 'portionSizeMethodId')
  declare parameters?: NonAttribute<CategoryPortionSizeMethodParameter[]>;
}

export type CategoryPortionSizeMethodAttributes = Attributes<CategoryPortionSizeMethod>;
export type CategoryPortionSizeMethodCreationAttributes =
  CreationAttributes<CategoryPortionSizeMethod>;
