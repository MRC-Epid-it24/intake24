import { BelongsTo, Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import { AsServedSet as AsServedSetAttributes } from '@common/types/models';
import BaseModel from '../model';
import { AsServedImage, ProcessedImage } from '.';

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
export default class AsServedSet extends BaseModel implements AsServedSetAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public selectionImageId!: number;

  @BelongsTo(() => ProcessedImage, 'selectionImageId')
  public selectionImage?: ProcessedImage;

  @HasMany(() => AsServedImage, 'asServedSetId')
  public asServedImages?: AsServedImage[];
}
