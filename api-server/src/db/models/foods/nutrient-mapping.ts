import { BelongsTo, Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { FoodLocal, NutrientTableRecord } from '.';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_nutrient_mapping',
})
export default class NutrientMapping extends BaseModel<NutrientMapping> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @BelongsTo(() => FoodLocal, 'food_local_id')
  public foodLocal?: FoodLocal;

  @BelongsTo(() => NutrientTableRecord, 'nutrient_table_record_id')
  public nutrientTableRecord?: NutrientTableRecord;
}
