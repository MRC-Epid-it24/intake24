import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { AsServedImage, AsServedSet, ImageMap, ProcessedImage } from '.';

@Scopes(() => ({
  asServedSets: { include: [{ model: AsServedSet }] },
  asServedImages: { include: [{ model: AsServedImage, as: 'asServedImages' }] },
  asServedThumbnailImages: { include: [{ model: AsServedImage, as: 'asServedThumbnailImages' }] },
  imageMaps: { include: [{ model: ImageMap }] },
}))
@Table({
  modelName: 'SourceImage',
  tableName: 'source_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SourceImage extends BaseModel {
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
    type: DataType.STRING(256),
  })
  public uploader!: string;

  @Column({
    allowNull: false,
    defaultValue: () => new Date(),
  })
  public uploadedAt!: Date;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  public thumbnailPath!: string;

  @HasMany(() => ProcessedImage, 'sourceId')
  public processedImages?: ProcessedImage[];
}
