import { BelongsTo, Column, Table } from 'sequelize-typescript';
import { NutrientTable } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableCsvMappingFieldColumn',
  tableName: 'nutrient_table_csv_mapping_field_columns',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableCsvMappingFieldColumn extends BaseModel {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
  })
  public fieldName!: string;

  @Column({
    allowNull: false,
  })
  public columnOffset!: number;

  @BelongsTo(() => NutrientTable, 'nutrientTableId')
  public nutrientTable?: NutrientTable;
}
