import { Column, DataType, HasMany, HasOne, Scopes, Table } from 'sequelize-typescript';

import type {
  NutrientTableAttributes,
  NutrientTableCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import {
  NutrientTableCsvMapping,
  NutrientTableCsvMappingField,
  NutrientTableCsvMappingNutrient,
  NutrientTableRecord,
} from '.';

@Scopes(() => ({
  list: { order: [['id', 'ASC']] },
}))
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
