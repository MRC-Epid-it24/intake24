import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { DrinkwareSet as DrinkwareSetAttributes } from '@common/types/models';
import BaseModel from '../model';
import { DrinkwareScale, GuideImage } from '.';

@Scopes(() => ({
  guideImage: { include: [{ model: GuideImage }] },
  scales: { include: [{ model: DrinkwareScale }] },
}))
@Table({
  modelName: 'DrinkwareSet',
  tableName: 'drinkware_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareSet extends BaseModel implements DrinkwareSetAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public guideImageId!: string;

  @BelongsTo(() => GuideImage, 'guideImageId')
  public guideImage?: GuideImage;

  @HasMany(() => DrinkwareScale, 'drinkwareSetId')
  public scales?: DrinkwareScale[];
}
