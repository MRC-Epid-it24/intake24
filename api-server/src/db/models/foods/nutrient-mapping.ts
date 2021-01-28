import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { FoodLocal, NutrientTableRecord } from '.';

@Table({
  modelName: 'NutrientMapping',
  tableName: 'food_nutrient_mapping',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientMapping extends BaseModel<NutrientMapping> {
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
  public nutrientTableRecordId!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodLocalId!: number;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  public foodLocal?: FoodLocal;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public nutrientTableRecord?: NutrientTableRecord;
}
