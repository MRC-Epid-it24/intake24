import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { SourceImageKeywordAttributes } from '@common/types/models/foods';
import BaseModel from '../model';
import { SourceImage } from '.';

@Scopes(() => ({
  sourceImage: { include: [{ model: SourceImage }] },
}))
@Table({
  modelName: 'SourceImageKeyword',
  tableName: 'source_image_keywords',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SourceImageKeyword
  extends BaseModel<SourceImageKeywordAttributes>
  implements SourceImageKeywordAttributes
{
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public sourceImageId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public keyword!: string;

  @BelongsTo(() => SourceImage, 'sourceImageId')
  public sourceImage?: SourceImage;
}
