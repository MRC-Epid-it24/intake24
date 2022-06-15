import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import type {
  DrinkwareScaleAttributes,
  DrinkwareScaleCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';
import { DrinkwareSet, DrinkwareVolumeSample } from '.';

@Scopes(() => ({
  drinkwareSet: { include: [{ model: DrinkwareSet }] },
  volumeSamples: { include: [{ model: DrinkwareVolumeSample }] },
}))
@Table({
  modelName: 'DrinkwareScale',
  tableName: 'drinkware_scales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareScale
  extends BaseModel<DrinkwareScaleAttributes, DrinkwareScaleCreationAttributes>
  implements DrinkwareScaleAttributes
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
  public drinkwareSetId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public width!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public height!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public emptyLevel!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public fullLevel!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public choiceId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public baseImageUrl!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public overlayImageUrl!: string;

  @BelongsTo(() => DrinkwareSet, 'drinkwareSetId')
  public drinkwareSet?: DrinkwareSet;

  @HasMany(() => DrinkwareVolumeSample, 'drinkwareScaleId')
  public volumeSamples?: DrinkwareVolumeSample[];
}
