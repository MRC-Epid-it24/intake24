import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import {
  SourceImageAttributes,
  SourceImageCreationAttributes,
} from '@intake24/common/types/models/foods';
import BaseModel from '../model';
import { ProcessedImage, SourceImageKeyword } from '.';

@Scopes(() => ({
  keywords: { include: [{ model: SourceImageKeyword }] },
  processedImages: { include: [{ model: ProcessedImage }] },
}))
@Table({
  modelName: 'SourceImage',
  tableName: 'source_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SourceImage
  extends BaseModel<SourceImageAttributes, SourceImageCreationAttributes>
  implements SourceImageAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  public path!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(1024),
  })
  public thumbnailPath!: string;

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

  @HasMany(() => SourceImageKeyword, 'sourceImageId')
  public keywords?: SourceImageKeyword[];

  @HasMany(() => ProcessedImage, 'sourceId')
  public processedImages?: ProcessedImage[];
}
