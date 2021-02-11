import { Column, HasMany, HasOne, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import BaseModel from '../model';
import {
  NutrientTableCsvMapping,
  NutrientTableCsvMappingFieldColumn,
  NutrientTableCsvMappingNutrientColumn,
} from '.';

@Table({
  modelName: 'NutrientTable',
  tableName: 'nutrient_tables',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTable extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @HasMany(() => NutrientTableRecord, 'nutrientTableId')
  records?: NutrientTableRecord[];

  @HasOne(() => NutrientTableCsvMapping, 'nutrientTableId')
  csvMapping?: NutrientTableCsvMapping;

  @HasMany(() => NutrientTableCsvMappingFieldColumn, 'nutrientTableId')
  csvMappingFields?: NutrientTableCsvMappingFieldColumn[];

  @HasMany(() => NutrientTableCsvMappingNutrientColumn, 'nutrientTableId')
  csvMappingNutrients?: NutrientTableCsvMappingFieldColumn[];
}
