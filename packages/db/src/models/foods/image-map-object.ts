import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type {
  ImageMapObjectAttributes,
  ImageMapObjectCreationAttributes,
} from '@intake24/common/types/models';

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
  implements ImageMapObjectAttributes
{
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

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
    type: DataType.INTEGER,
  })
  public navigationIndex!: number;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get outlineCoordinates(): number[] {
    const val = this.getDataValue('outlineCoordinates') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set outlineCoordinates(value: number[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('outlineCoordinates', JSON.stringify(value ?? []));
  }

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public overlayImageId!: string | null;

  @BelongsTo(() => ImageMap, 'imageMapId')
  public imageMap?: ImageMap;

  @BelongsTo(() => ProcessedImage, 'overlayImageId')
  public overlayImage?: ProcessedImage;
}
