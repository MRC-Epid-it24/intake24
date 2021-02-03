import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { AsServedImage as AsServedImageAttributes } from '@common/types/models';
import BaseModel from '../model';
import { AsServedSet, ProcessedImage } from '.';

@Scopes(() => ({
  asServedSet: { include: [{ model: AsServedSet }] },
  image: { include: [{ model: ProcessedImage, as: 'image' }] },
  thumbnailImage: { include: [{ model: ProcessedImage, as: 'thumbnailImage' }] },
}))
@Table({
  modelName: 'AsServedImage',
  tableName: 'as_served_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AsServedImage extends BaseModel implements AsServedImageAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
  })
  public weight!: number;

  @Column({
    allowNull: false,
  })
  public asServedSetId!: string;

  @Column({
    allowNull: false,
  })
  public imageId!: number;

  @Column({
    allowNull: false,
  })
  public thumbnailImageId!: number;

  @BelongsTo(() => AsServedSet, 'asServedSetId')
  public asServedSet?: AsServedSet;

  @BelongsTo(() => ProcessedImage, 'imageId')
  public image?: ProcessedImage;

  @BelongsTo(() => ProcessedImage, 'thumbnailImageId')
  public thumbnailImage?: ProcessedImage;
}
