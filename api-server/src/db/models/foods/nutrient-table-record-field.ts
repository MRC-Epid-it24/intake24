import { BelongsTo, Column, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'nutrient_table_record_fields',
})
export default class NutrientTableRecordField extends BaseModel<NutrientTableRecordField> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public name!: string;

  @Column({
    allowNull: false,
  })
  public value!: string;

  @BelongsTo(() => NutrientTableRecord, 'nutrient_table_record_id')
  public record?: NutrientTableRecord;
}
