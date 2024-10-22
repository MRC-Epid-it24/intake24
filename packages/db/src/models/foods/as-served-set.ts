import type {
  Attributes,
  CreationAttributes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import { AsServedImage, ProcessedImage } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  selectionImage: { include: [{ model: ProcessedImage }] },
  asServedImages: { include: [{ model: AsServedImage }] },
}))
@Table({
  modelName: 'AsServedSet',
  tableName: 'as_served_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AsServedSet extends BaseModel<
  InferAttributes<AsServedSet>,
  InferCreationAttributes<AsServedSet>
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
    type: DataType.BIGINT,
  })
  declare selectionImageId: ForeignKey<ProcessedImage['id']>;

  @BelongsTo(() => ProcessedImage, 'selectionImageId')
  declare selectionImage?: NonAttribute<ProcessedImage>;

  @HasMany(() => AsServedImage, 'asServedSetId')
  declare asServedImages?: NonAttribute<AsServedImage[]>;
}

export type AsServedSetAttributes = Attributes<AsServedSet>;
export type AsServedSetCreationAttributes = CreationAttributes<AsServedSet>;
