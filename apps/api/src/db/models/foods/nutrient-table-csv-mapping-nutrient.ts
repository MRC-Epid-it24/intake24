import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import {
  NutrientTableCsvMappingNutrientAttributes,
  NutrientTableCsvMappingNutrientCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';
import { NutrientTable, FoodsNutrientType } from '.';

@Table({
  modelName: 'NutrientTableCsvMappingNutrient',
  tableName: 'nutrient_table_csv_mapping_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableCsvMappingNutrient extends BaseModel<
  NutrientTableCsvMappingNutrientAttributes,
  NutrientTableCsvMappingNutrientCreationAttributes
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
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

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

  @BelongsTo(() => FoodsNutrientType, 'nutrientTypeId')
  public nutrientType?: FoodsNutrientType;
}
