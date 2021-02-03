import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import NutrientTable from '@api-server/db/models/foods/nutrient-table';
import NutrientTableRecordNutrient from '@api-server/db/models/foods/nutrient-table-record-nutrient';
import { NutrientMapping, NutrientTableRecordField } from '@api-server/db/models/foods/index';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecord',
  tableName: 'nutrient_table_records',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecord extends BaseModel {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
  })
  public nutrientTableRecordId!: string;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  public localName!: string | null;

  @BelongsTo(() => NutrientTable, 'nutrientTableId')
  public nutrientTable?: NutrientTable;

  @HasMany(() => NutrientMapping, 'nutrientTableRecordId')
  public mappings?: NutrientMapping[];

  @HasMany(() => NutrientTableRecordNutrient, 'nutrientTableRecordId')
  public nutrients?: NutrientTableRecordNutrient[];

  @HasMany(() => NutrientTableRecordField, 'nutrientTableRecordId')
  public fields?: NutrientTableRecordField[];

  getNutrientByType(nutrientTypeId: number): NutrientTableRecordNutrient | undefined {
    if (this.nutrients) {
      for (let i = 0; i < this.nutrients.length; ++i) {
        if (this.nutrients[i].nutrientTypeId === nutrientTypeId) return this.nutrients[i];
      }
    }
    return undefined;
  }
}
