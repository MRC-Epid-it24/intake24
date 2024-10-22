import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';

import { ImageMap, ProcessedImage } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'ImageMapObject',
  tableName: 'image_map_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ImageMapObject extends BaseModel<
  InferAttributes<ImageMapObject>,
  InferCreationAttributes<ImageMapObject>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  declare imageMapId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare navigationIndex: number;

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
  declare overlayImageId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get label(): LocaleTranslation {
    const val = this.getDataValue('label') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set label(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('label', JSON.stringify(value ?? {}));
  }

  @BelongsTo(() => ImageMap, 'imageMapId')
  declare imageMap?: NonAttribute<ImageMap>;

  @BelongsTo(() => ProcessedImage, 'overlayImageId')
  declare overlayImage?: NonAttribute<ProcessedImage | null>;
}

export type ImageMapObjectAttributes = Attributes<ImageMapObject>;
export type ImageMapObjectCreationAttributes = CreationAttributes<ImageMapObject>;
