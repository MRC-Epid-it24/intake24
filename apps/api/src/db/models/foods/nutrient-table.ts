import { Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api/db/models/foods/nutrient-table-record';
import { NutrientTableAttributes, NutrientTableCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import {
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
} from '.';

@Table({
  modelName: 'NutrientTable',
  tableName: 'nutrient_tables',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTable extends BaseModel<
  NutrientTableAttributes,
  NutrientTableCreationAttributes
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @HasMany(() => NutrientTableRecord, 'nutrientTableId')
  records?: NutrientTableRecord[];

  @HasOne(() => NutrientTableCsvMapping, 'nutrientTableId')
  csvMapping?: NutrientTableCsvMapping;

  @HasMany(() => NutrientTableCsvMappingField, 'nutrientTableId')
  csvMappingFields?: NutrientTableCsvMappingField[];

  @HasMany(() => NutrientTableCsvMappingNutrient, 'nutrientTableId')
  csvMappingNutrients?: NutrientTableCsvMappingNutrient[];
}
