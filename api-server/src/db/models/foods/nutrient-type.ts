import { BelongsTo, Column, Table } from 'sequelize-typescript';
import NutrientUnit from '@api-server/db/models/foods/nutrient-unit';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientType',
  tableName: 'nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientType extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public unitId!: number;

  @Column({ allowNull: false })
  public description!: string;

  @BelongsTo(() => NutrientUnit, 'unitId')
  public unit?: NutrientUnit;
}
