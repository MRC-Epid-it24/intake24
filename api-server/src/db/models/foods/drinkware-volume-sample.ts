import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import { DrinkwareVolumeSample as DrinkwareVolumeSampleAttributes } from '@common/types/models';
import BaseModel from '../model';
import { DrinkwareScale } from '.';

@Scopes(() => ({
  scale: { include: [{ model: DrinkwareScale }] },
}))
@Table({
  modelName: 'DrinkwareVolumeSample',
  tableName: 'drinkware_volume_samples',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareVolumeSample
  extends BaseModel
  implements DrinkwareVolumeSampleAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public drinkwareScaleId!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public fill!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public volume!: number;

  @BelongsTo(() => DrinkwareScale, 'drinkwareScaleId')
  public scale?: DrinkwareScale;
}
