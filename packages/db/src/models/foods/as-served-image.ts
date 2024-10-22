import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import { AsServedSet, ProcessedImage } from '.';
import BaseModel from '../model';

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
export default class AsServedImage extends BaseModel<
  InferAttributes<AsServedImage>,
  InferCreationAttributes<AsServedImage>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
  })
  declare weight: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare asServedSetId: ForeignKey<AsServedSet['id']>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare imageId: ForeignKey<ProcessedImage['id']>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare thumbnailImageId: ForeignKey<ProcessedImage['id']>;

  @BelongsTo(() => AsServedSet, 'asServedSetId')
  declare asServedSet?: NonAttribute<AsServedSet>;

  @BelongsTo(() => ProcessedImage, 'imageId')
  declare image?: NonAttribute<ProcessedImage>;

  @BelongsTo(() => ProcessedImage, 'thumbnailImageId')
  declare thumbnailImage?: NonAttribute<ProcessedImage>;
}

export type AsServedImageAttributes = Attributes<AsServedImage>;
export type AsServedImageCreationAttributes = CreationAttributes<AsServedImage>;
