import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { DrinkwareSet, GuideImage, ImageMapObject, ProcessedImage } from '.';

@Scopes(() => ({
  guideImages: { include: [{ model: GuideImage }] },
  baseImage: { include: [{ model: ProcessedImage }] },
  objects: { include: [{ model: ImageMapObject }] },
}))
@Table({
  modelName: 'ImageMap',
  tableName: 'image_maps',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ImageMap extends BaseModel<
  InferAttributes<ImageMap>,
  InferCreationAttributes<ImageMap>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare baseImageId: string;

  @BelongsTo(() => ProcessedImage, 'baseImageId')
  declare baseImage?: NonAttribute<ProcessedImage>;

  @HasMany(() => DrinkwareSet, 'imageMapId')
  declare drinkwareSets?: NonAttribute<DrinkwareSet[]>;

  @HasMany(() => GuideImage, 'imageMapId')
  declare guideImages?: NonAttribute<GuideImage[]>;

  @HasMany(() => ImageMapObject, 'imageMapId')
  declare objects?: NonAttribute<ImageMapObject[]>;
}

export type ImageMapAttributes = Attributes<ImageMap>;
export type ImageMapCreationAttributes = CreationAttributes<ImageMap>;
