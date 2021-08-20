import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import NutrientType from '@api-server/db/models/foods/nutrient-type';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecordNutrient',
  tableName: 'nutrient_table_record_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecordNutrient extends BaseModel {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTableRecordId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

  @Column({
    allowNull: false,
    field: 'units_per_100g',
  })
  public unitsPer100g!: number;

  @BelongsTo(() => NutrientType, 'nutrientTypeId')
  public nutrientType?: NutrientType;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public record?: NutrientTableRecord;
}
