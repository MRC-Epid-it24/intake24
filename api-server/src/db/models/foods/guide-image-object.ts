import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { GuideImage } from '.';

@Table({
  modelName: 'GuideImageObject',
  tableName: 'guide_image_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GuideImageObject extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public guideImageId!: string;

  @Column({
    allowNull: false,
  })
  public weight!: number;

  @Column({
    allowNull: false,
  })
  public imageMapObjectId!: number;

  @BelongsTo(() => GuideImage, 'guideImageId')
  public guideImage?: GuideImage;
}
