import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { NutrientTable, NutrientType } from '.';

@Table({
  modelName: 'NutrientTableCsvMappingNutrientColumn',
  tableName: 'nutrient_table_csv_mapping_nutrient_columns',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableCsvMappingNutrientColumn extends BaseModel {
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
  public nutrientTypeId!: number;

  @Column({
    allowNull: false,
  })
  public columnOffset!: number;

  @BelongsTo(() => NutrientTable, 'nutrientTableId')
  public nutrientTable?: NutrientTable;

  @BelongsTo(() => NutrientType, 'nutrientTypeId')
  public nutrientType?: NutrientType;
}
