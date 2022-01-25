import { BelongsTo, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import {
  NutrientTypeInKcalAttributes,
  NutrientTypeInKcalCreationAttributes,
} from '@intake24/common/types/models';
import { FoodsNutrientType } from '.';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTypeInKcal',
  tableName: 'nutrient_type_in_kcal',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTypeInKcal
  extends BaseModel<NutrientTypeInKcalAttributes, NutrientTypeInKcalCreationAttributes>
  implements NutrientTypeInKcalAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public kcalPerUnit!: number;

  @BelongsTo(() => FoodsNutrientType, 'nutrientTypeId')
  public nutrient?: FoodsNutrientType;
}
