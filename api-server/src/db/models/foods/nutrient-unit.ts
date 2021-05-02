import { Column, Table } from 'sequelize-typescript';
import { NutrientUnitAttributes } from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientUnit',
  tableName: 'nutrient_units',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientUnit
  extends BaseModel<NutrientUnitAttributes>
  implements NutrientUnitAttributes {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
  })
  public symbol!: string;
}
