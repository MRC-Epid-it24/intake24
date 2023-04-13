import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { AsServedImage, AsServedSet, ImageMap, SourceImage } from '.';

export enum ProcessedImagePurposes {
  AsServedMainImage = 1,
  AsServedThumbnail = 2,
  SelectionImage = 3,
  ImageMapBaseImage = 4,
  ImageMapOverlay = 5,
}

export type ProcessedImagePurpose = ProcessedImagePurposes;

@Scopes(() => ({
  asServedSets: { include: [{ model: AsServedSet }] },
  asServedImages: { include: [{ model: AsServedImage, as: 'asServedImages' }] },
  asServedThumbnailImages: { include: [{ model: AsServedImage, as: 'asServedThumbnailImages' }] },
  imageMaps: { include: [{ model: ImageMap }] },
}))
@Table({
  modelName: 'ProcessedImage',
  tableName: 'processed_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ProcessedImage extends BaseModel<
  InferAttributes<ProcessedImage>,
  InferCreationAttributes<ProcessedImage>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  declare path: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare sourceId: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare purpose: ProcessedImagePurpose;

  @Column({
    allowNull: false,
    type: DataType.DATE,
    defaultValue: () => new Date(),
  })
  declare createdAt: CreationOptional<Date>;

  @BelongsTo(() => SourceImage, 'sourceId')
  declare sourceImage?: NonAttribute<SourceImage>;

  @HasMany(() => AsServedSet, 'selectionImageId')
  declare asServedSets?: NonAttribute<AsServedSet[]>;

  @HasMany(() => AsServedImage, 'imageId')
  declare asServedImages?: NonAttribute<AsServedImage[]>;

  @HasMany(() => AsServedImage, 'thumbnailImageId')
  declare asServedThumbnailImages?: NonAttribute<AsServedImage[]>;

  @HasMany(() => ImageMap, 'baseImageId')
  declare imageMaps?: NonAttribute<ImageMap[]>;
}

export type ProcessedImageAttributes = Attributes<ProcessedImage>;
export type ProcessedImageCreationAttributes = CreationAttributes<ProcessedImage>;
