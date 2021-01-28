import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import BaseModel from '../model';
import { ImageMap, ProcessedImage } from '.';

@Table({
  modelName: 'ImageMapObject',
  tableName: 'image_map_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ImageMapObject extends BaseModel<ImageMapObject> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public imageMapId!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public navigationIndex!: number;

  @Column({
    type: DataTypes.ARRAY(DataTypes.DOUBLE),
    allowNull: false,
  })
  public outlineCoordinates!: number[];

  @Column({
    allowNull: false,
  })
  public overlayImageId!: number;

  @BelongsTo(() => ImageMap, 'imageMapId')
  public imageMap?: ImageMap;

  @BelongsTo(() => ProcessedImage, 'overlayImageId')
  public overlayImage?: ProcessedImage;
}
