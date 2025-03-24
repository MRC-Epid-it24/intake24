import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';
import { GuideImageObject, ImageMap, ProcessedImage } from '.';
import BaseModel from '../model';

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
export default class GuideImage extends BaseModel<
  InferAttributes<GuideImage>,
  InferCreationAttributes<GuideImage>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare imageMapId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare selectionImageId: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get label(): CreationOptional<LocaleTranslation> {
    const val = this.getDataValue('label') as unknown as string | null;
    return val ? JSON.parse(val) : {};
  }

  set label(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('label', value && Object.keys(value).length ? JSON.stringify(value) : null);
  }

  @BelongsTo(() => ImageMap, 'imageMapId')
  declare imageMap?: NonAttribute<ImageMap>;

  @BelongsTo(() => ProcessedImage, 'selectionImageId')
  declare selectionImage?: NonAttribute<ProcessedImage>;

  @HasMany(() => GuideImageObject, 'guideImageId')
  declare objects?: NonAttribute<GuideImageObject[]>;
}

export type GuideImageAttributes = Attributes<GuideImage>;
export type GuideImageCreationAttributes = CreationAttributes<GuideImage>;
