import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import { NutrientTypeAttributes, NutrientTypeCreationAttributes } from '@common/types/models';
import BaseModel from '../model';
import { NutrientUnit } from '.';

@Scopes(() => ({
  unit: { include: [{ model: NutrientUnit }] },
}))
@Table({
  modelName: 'NutrientType',
  tableName: 'nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientType
  extends BaseModel<NutrientTypeAttributes>
  implements NutrientTypeAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public description!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  @ForeignKey(() => NutrientUnit)
  public unitId!: string;

  @BelongsTo(() => NutrientUnit, 'unitId')
  public unit?: NutrientUnit;
}
