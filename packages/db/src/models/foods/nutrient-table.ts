import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { Column, DataType, HasMany, HasOne, Scopes, Table } from 'sequelize-typescript';

import type { NutrientTableRecordCreationAttributes } from './nutrient-table-record';
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
  InferAttributes<NutrientTable>,
  InferCreationAttributes<NutrientTable> & {
    records?: NutrientTableRecordCreationAttributes[];
  }
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare description: string;

  @HasMany(() => NutrientTableRecord, 'nutrientTableId')
  records?: NonAttribute<NutrientTableRecord[]>;

  @HasOne(() => NutrientTableCsvMapping, 'nutrientTableId')
  csvMapping?: NonAttribute<NutrientTableCsvMapping>;

  @HasMany(() => NutrientTableCsvMappingField, 'nutrientTableId')
  csvMappingFields?: NonAttribute<NutrientTableCsvMappingField[]>;

  @HasMany(() => NutrientTableCsvMappingNutrient, 'nutrientTableId')
  csvMappingNutrients?: NonAttribute<NutrientTableCsvMappingNutrient[]>;
}

export type NutrientTableAttributes = Attributes<NutrientTable>;
export type NutrientTableCreationAttributes = CreationAttributes<NutrientTable>;
