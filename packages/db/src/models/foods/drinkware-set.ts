import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import type { DrinkwareSetAttributes } from '@intake24/common/types/models';

import BaseModel from '../model';
import { DrinkwareScale, ImageMap } from '.';

@Scopes(() => ({
  scales: { include: [{ model: DrinkwareScale }] },
}))
@Table({
  modelName: 'DrinkwareSet',
  tableName: 'drinkware_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareSet
  extends BaseModel<DrinkwareSetAttributes>
  implements DrinkwareSetAttributes
{
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

  @BelongsTo(() => ImageMap, 'guideImageId')
  public imageMap?: ImageMap;

  @HasMany(() => DrinkwareScale, 'drinkwareSetId')
  public scales?: DrinkwareScale[];
}
