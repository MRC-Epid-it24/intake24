import { Column, Table } from 'sequelize-typescript';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  freezeTableName: true,
  tableName: 'nutrient_units',
})
export default class NutrientUnit extends BaseModel<NutrientUnit> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({ allowNull: false })
  public description!: string;

  @Column({ allowNull: false })
  public symbol!: string;
}
