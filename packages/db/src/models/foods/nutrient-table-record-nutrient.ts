import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { NutrientTableRecord, FoodsNutrientType } from '@intake24/db';
import type {
  NutrientTableRecordNutrientAttributes,
  NutrientTableRecordNutrientCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecordNutrient',
  tableName: 'nutrient_table_record_nutrients',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecordNutrient extends BaseModel<
  NutrientTableRecordNutrientAttributes,
  NutrientTableRecordNutrientCreationAttributes
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTableRecordId!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

  @Column({
    allowNull: false,
    field: 'units_per_100g',
    type: DataType.DOUBLE,
  })
  public unitsPer100g!: number;

  @BelongsTo(() => FoodsNutrientType, 'nutrientTypeId')
  public nutrientType?: FoodsNutrientType;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public record?: NutrientTableRecord;
}
