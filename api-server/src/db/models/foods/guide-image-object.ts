import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { GuideImage, ImageMap, ProcessedImage } from '.';

@Table({
  tableName: 'guide_image_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GuideImageObject extends BaseModel<GuideImageObject> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public weight!: number;

  @Column({
    allowNull: false,
  })
  public imageMapObjectId!: number;

  @BelongsTo(() => GuideImage, 'guide_image_id')
  public guideImage?: GuideImage;
}
