import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { GuideImageAttributes } from '@common/types/models';
import BaseModel from '../model';
import { GuideImageObject, ImageMap, ProcessedImage } from '.';

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
export default class GuideImage
  extends BaseModel<GuideImageAttributes>
  implements GuideImageAttributes
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
    type: DataType.STRING(32),
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
