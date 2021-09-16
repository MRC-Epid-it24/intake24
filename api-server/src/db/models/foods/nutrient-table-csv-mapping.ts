import { NutrientTableCsvMappingAttributes } from '@common/types/models';
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
export default class NutrientTableCsvMapping extends BaseModel<NutrientTableCsvMappingAttributes> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
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
    allowNull: true,
    type: DataType.INTEGER,
  })
  public localDescriptionColumnOffset!: number | null;

  @BelongsTo(() => NutrientTable, {
    foreignKey: 'nutrientTableId',
    onUpdate: 'cascade',
    onDelete: 'cascade',
  })
  public nutrientTable?: NutrientTable;
}
