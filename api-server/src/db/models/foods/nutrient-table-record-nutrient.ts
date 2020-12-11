import { BelongsTo, Column, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import NutrientType from '@api-server/db/models/foods/nutrient-type';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'nutrient_table_record_nutrients',
})
export default class NutrientTableRecordNutrient extends BaseModel<NutrientTableRecordNutrient> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public nutrientTypeId!: number;

  @Column({
    allowNull: false,
    field: 'units_per_100g',
  })
  public unitsPer100g!: number;

  @BelongsTo(() => NutrientType, 'nutrient_type_id')
  public nutrientType?: NutrientType;

  @BelongsTo(() => NutrientTableRecord, 'nutrient_table_record_id')
  public record?: NutrientTableRecord;
}
