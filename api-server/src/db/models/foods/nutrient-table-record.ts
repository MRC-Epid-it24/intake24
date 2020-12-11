import { BelongsTo, Column, HasMany, Table } from 'sequelize-typescript';
import NutrientTable from '@api-server/db/models/foods/nutrient-table';
import NutrientTableRecordNutrient from '@api-server/db/models/foods/nutrient-table-record-nutrient';
import { NutrientTableRecordField } from '@api-server/db/models/foods/index';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'nutrient_table_records',
})
export default class NutrientTableRecord extends BaseModel<NutrientTableRecord> {
  @Column({
    allowNull: false,
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
  public nutrientTableRecordId!: string;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column
  public localName!: string;

  @BelongsTo(() => NutrientTable, 'nutrient_table_id')
  public nutrientTable?: NutrientTable;

  @HasMany(() => NutrientTableRecordNutrient, 'nutrient_table_record_id')
  public nutrients?: NutrientTableRecordNutrient[];

  @HasMany(() => NutrientTableRecordField, 'nutrient_table_record_id')
  public fields?: NutrientTableRecordNutrient[];

  getNutrientByType(nutrientTypeId: number): NutrientTableRecordNutrient | undefined {
    if (this.nutrients) {
      for (let i = 0; i < this.nutrients.length; ++i) {
        if (this.nutrients[i].nutrientTypeId === nutrientTypeId) return this.nutrients[i];
      }
    }
    return undefined;
  }
}
