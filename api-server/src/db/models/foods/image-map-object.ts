import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { ImageMapObjectAttributes, ImageMapObjectCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { ImageMap, ProcessedImage } from '.';

@Table({
  modelName: 'ImageMapObject',
  tableName: 'image_map_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ImageMapObject
  extends BaseModel<ImageMapObjectAttributes, ImageMapObjectCreationAttributes>
  implements ImageMapObjectAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public imageMapId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public navigationIndex!: number;

  // TODO: convert to mysql-compatible data type
  @Column({
    type: DataType.ARRAY(DataType.DOUBLE),
    allowNull: false,
  })
  public outlineCoordinates!: number[];

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public overlayImageId!: number | null;

  @BelongsTo(() => ImageMap, 'imageMapId')
  public imageMap?: ImageMap;

  @BelongsTo(() => ProcessedImage, 'overlayImageId')
  public overlayImage?: ProcessedImage;
}
