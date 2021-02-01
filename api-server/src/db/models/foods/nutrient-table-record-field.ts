import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecordField',
  tableName: 'nutrient_table_record_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecordField extends BaseModel {
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
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public record?: NutrientTableRecord;
}
