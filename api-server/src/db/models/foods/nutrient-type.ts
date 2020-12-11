import { BelongsTo, Column, Table } from 'sequelize-typescript';
import NutrientUnit from '@api-server/db/models/foods/nutrient-unit';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'nutrient_types',
})
export default class NutrientType extends BaseModel<NutrientType> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({ allowNull: false })
  public description!: string;

  @BelongsTo(() => NutrientUnit, 'unit_id')
  public unit?: NutrientUnit;
}
