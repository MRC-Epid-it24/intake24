import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import {
  ProcessedImage as ProcessedImageAttributes,
  ProcessedImagePurpose,
} from '@common/types/models/foods';
import BaseModel from '../model';
import { AsServedImage, AsServedSet, ImageMap } from '.';

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
export default class ProcessedImage extends BaseModel implements ProcessedImageAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  public path!: string;

  @Column({
    allowNull: false,
  })
  public sourceId!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public purpose!: ProcessedImagePurpose;

  @Column({
    allowNull: false,
    defaultValue: () => new Date(),
  })
  public createdAt!: Date;

  @HasMany(() => AsServedSet, 'selectionImageId')
  public asServedSets?: AsServedSet[];

  @HasMany(() => AsServedImage, 'imageId')
  public asServedImages?: AsServedImage[];

  @HasMany(() => AsServedImage, 'thumbnailImageId')
  public asServedThumbnailImages?: AsServedImage[];

  @HasMany(() => ImageMap, 'baseImageId')
  public imageMaps?: ImageMap[];
}
