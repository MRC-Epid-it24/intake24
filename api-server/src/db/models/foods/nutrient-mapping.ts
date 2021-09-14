import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { NutrientMappingAttributes, NutrientMappingCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { FoodLocal, NutrientTableRecord } from '.';

@Table({
  modelName: 'NutrientMapping',
  tableName: 'food_nutrient_mapping',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientMapping
  extends BaseModel<NutrientMappingAttributes, NutrientMappingCreationAttributes>
  implements NutrientMappingAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @ForeignKey(() => NutrientTableRecord)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTableRecordId!: string;

  @ForeignKey(() => FoodLocal)
  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public foodLocalId!: string;

  @BelongsTo(() => FoodLocal, 'foodLocalId')
  public foodLocal?: FoodLocal;

  @BelongsTo(() => NutrientTableRecord, 'nutrientTableRecordId')
  public nutrientTableRecord?: NutrientTableRecord;
}
