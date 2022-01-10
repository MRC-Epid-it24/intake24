import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { FoodNutrientAttributes } from '@intake24/common/types/models';
import BaseModel from '../model';
import { FoodLocal, NutrientTableRecord } from '.';

@Table({
  modelName: 'FoodNutrient',
  tableName: 'foods_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FoodNutrient
  extends BaseModel<FoodNutrientAttributes>
  implements FoodNutrientAttributes
{
  @ForeignKey(() => FoodLocal)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodLocalId!: string;

  @ForeignKey(() => NutrientTableRecord)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTableRecordId!: string;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  public foodLocal?: FoodLocal;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public nutrientTableRecord?: NutrientTableRecord;
}
