import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { GuideImageObject as GuideImageObjectAttributes } from '@common/types/models';
import BaseModel from '../model';
import { GuideImage } from '.';

@Table({
  modelName: 'GuideImageObject',
  tableName: 'guide_image_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GuideImageObject extends BaseModel implements GuideImageObjectAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public guideImageId!: string;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public weight!: number;

  @Column({
    allowNull: false,
  })
  public imageMapObjectId!: number;

  @BelongsTo(() => GuideImage, 'guideImageId')
  public guideImage?: GuideImage;
}
