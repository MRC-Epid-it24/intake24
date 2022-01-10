import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { CategoryPortionSizeMethodParameter } from '@intake24/db';
import {
  PortionSizeMethodId,
  CategoryPortionSizeMethodAttributes,
  CategoryPortionSizeMethodCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import CategoryLocal from './category-local';

@Table({
  modelName: 'CategoryPortionSizeMethod',
  tableName: 'category_portion_size_methods',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class CategoryPortionSizeMethod
  extends BaseModel<
    CategoryPortionSizeMethodAttributes,
    CategoryPortionSizeMethodCreationAttributes
  >
  implements CategoryPortionSizeMethodAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public categoryLocalId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public method!: PortionSizeMethodId;

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public imageUrl!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public useForRecipes!: boolean;

  @Column({
    allowNull: false,
    type: DataType.FLOAT(17),
  })
  public conversionFactor!: number;

  @BelongsTo(() => CategoryLocal, 'categoryLocalId')
  public categoryLocal?: CategoryLocal;

  @HasMany(() => CategoryPortionSizeMethodParameter, 'portionSizeMethodId')
  public parameters?: CategoryPortionSizeMethodParameter[];
}
