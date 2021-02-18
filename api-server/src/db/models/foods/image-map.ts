import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { ImageMap as ImageMapAttributes } from '@common/types/models';
import BaseModel from '../model';
import { GuideImage, ImageMapObject, ProcessedImage } from '.';

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
export default class ImageMap extends BaseModel implements ImageMapAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public baseImageId!: number;

  @BelongsTo(() => ProcessedImage, 'baseImageId')
  public baseImage?: ProcessedImage;

  @HasMany(() => GuideImage, 'imageMapId')
  public guideImages?: GuideImage[];

  @HasMany(() => ImageMapObject, 'imageMapId')
  public objects?: ImageMapObject[];
}
