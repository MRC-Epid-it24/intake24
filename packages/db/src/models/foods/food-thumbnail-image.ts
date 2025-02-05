import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import { FoodLocal, ProcessedImage } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  image: { include: [{ model: ProcessedImage, as: 'image' }] },
}))
@Table({
  modelName: 'FoodThumbnailImage',
  tableName: 'food_thumbnail_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodThumbnailImage extends BaseModel<
  InferAttributes<FoodThumbnailImage>,
  InferCreationAttributes<FoodThumbnailImage>
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
    type: DataType.BIGINT,
  })
  declare imageId: ForeignKey<ProcessedImage['id']>;

  @BelongsTo(() => ProcessedImage, 'imageId')
  declare image?: NonAttribute<ProcessedImage>;
}

export type FoodThumbnailImageAttributes = Attributes<FoodThumbnailImage>;
export type FoodThumbnailImageCreationAttributes = CreationAttributes<FoodThumbnailImage>;
