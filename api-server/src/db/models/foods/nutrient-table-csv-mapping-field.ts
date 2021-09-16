import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import {
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingFieldCreationAttributes,
} from '@common/types/models';
import { NutrientTable } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableCsvMappingField',
  tableName: 'nutrient_table_csv_mapping_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableCsvMappingField extends BaseModel<
  NutrientTableCsvMappingFieldAttributes,
  NutrientTableCsvMappingFieldCreationAttributes
> {
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
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public fieldName!: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public columnOffset!: number;

  @BelongsTo(() => NutrientTable, {
    foreignKey: 'nutrientTableId',
    onUpdate: 'cascade',
    onDelete: 'cascade',
  })
  public nutrientTable?: NutrientTable;
}
