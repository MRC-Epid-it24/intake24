import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import type { AsServedSetAttributes } from '@intake24/common/types/models';

import BaseModel from '../model';
import {
  AsServedImage,
  CategoryPortionSizeMethodParameter,
  FoodPortionSizeMethodParameter,
  ProcessedImage,
} from '.';

@Scopes(() => ({
  selectionImage: { include: [{ model: ProcessedImage }] },
  asServedImages: { include: [{ model: AsServedImage }] },
}))
@Table({
  modelName: 'AsServedSet',
  tableName: 'as_served_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AsServedSet
  extends BaseModel<AsServedSetAttributes>
  implements AsServedSetAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public selectionImageId!: string;

  @BelongsTo(() => ProcessedImage, 'selectionImageId')
  public selectionImage?: ProcessedImage;

  @HasMany(() => AsServedImage, 'asServedSetId')
  public asServedImages?: AsServedImage[];

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
