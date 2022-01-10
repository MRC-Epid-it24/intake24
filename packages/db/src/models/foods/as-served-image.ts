import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import {
  AsServedImageAttributes,
  AsServedImageCreationAttributes,
} from '@intake24/common/types/models';
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
export default class AsServedImage
  extends BaseModel<AsServedImageAttributes, AsServedImageCreationAttributes>
  implements AsServedImageAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
  })
  public weight!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public asServedSetId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public imageId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public thumbnailImageId!: string;

  @BelongsTo(() => AsServedSet, 'asServedSetId')
  public asServedSet?: AsServedSet;

  @BelongsTo(() => ProcessedImage, 'imageId')
  public image?: ProcessedImage;

  @BelongsTo(() => ProcessedImage, 'thumbnailImageId')
  public thumbnailImage?: ProcessedImage;
}
