import { Column, HasMany, Table } from 'sequelize-typescript';
import NutrientTableRecord from '@api-server/db/models/foods/nutrient-table-record';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'food_nutrient_mapping',
})
export default class NutrientTable extends BaseModel<NutrientTable> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: string;

  @Column
  public description!: string;

  @HasMany(() => NutrientTableRecord, 'nutrient_table_id')
  records?: NutrientTableRecord[];
}
