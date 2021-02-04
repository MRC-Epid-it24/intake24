import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { NutrientTable } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableCsvMapping',
  tableName: 'nutrient_table_csv_mapping',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableCsvMapping extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
  })
  public rowOffset!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public idColumnOffset!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public descriptionColumnOffset!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public localDescriptionColumnOffset!: number | null;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public localName!: string | null;

  @BelongsTo(() => NutrientTable, 'nutrientTableId')
  public nutrientTable?: NutrientTable;
}
