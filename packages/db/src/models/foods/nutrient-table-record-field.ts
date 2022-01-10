import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { NutrientTableRecord } from '@intake24/db';
import {
  NutrientTableRecordFieldAttributes,
  NutrientTableRecordFieldCreationAttributes,
} from '@intake24/common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecordField',
  tableName: 'nutrient_table_record_fields',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecordField extends BaseModel<
  NutrientTableRecordFieldAttributes,
  NutrientTableRecordFieldCreationAttributes
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
    type: DataType.STRING(32),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public value!: string;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public record?: NutrientTableRecord;
}
