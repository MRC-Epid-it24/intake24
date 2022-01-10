import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import {
  GuideImageObjectAttributes,
  GuideImageObjectCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { GuideImage } from '.';

@Table({
  modelName: 'GuideImageObject',
  tableName: 'guide_image_objects',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class GuideImageObject
  extends BaseModel<GuideImageObjectAttributes, GuideImageObjectCreationAttributes>
  implements GuideImageObjectAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

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
    type: DataType.BIGINT,
  })
  public imageMapObjectId!: string;

  @BelongsTo(() => GuideImage, 'guideImageId')
  public guideImage?: GuideImage;
}
