import { BelongsTo, Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import GuideImageObject from '@api-server/db/models/foods/guide-image-object';
import BaseModel from '../model';
import { ImageMap, ProcessedImage } from '.';

@Scopes(() => ({
  imageMap: { include: [{ model: ImageMap }] },
  selectionImage: { include: [{ model: ProcessedImage }] },
  objects: { include: [{ model: GuideImageObject }] },
}))
@Table({
  modelName: 'GuideImage',
  tableName: 'guide_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GuideImage extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public imageMapId!: string;

  @Column({
    allowNull: false,
  })
  public selectionImageId!: number;

  @BelongsTo(() => ImageMap, 'imageMapId')
  public imageMap?: ImageMap;

  @BelongsTo(() => ProcessedImage, 'selectionImageId')
  public selectionImage?: ProcessedImage;

  @HasMany(() => GuideImageObject, 'guideImageId')
  public objects?: GuideImageObject[];
}
