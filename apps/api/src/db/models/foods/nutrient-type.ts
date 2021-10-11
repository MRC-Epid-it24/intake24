import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import { NutrientTypeAttributes } from '@common/types/models';
import { DemographicGroup, NutrientUnit } from '.';
import BaseModel from '../model';

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
  public unitId!: string;

  @BelongsTo(() => NutrientUnit, 'unitId')
  public unit?: NutrientUnit;

  @HasMany(() => DemographicGroup, 'nutrientTypeId')
  public demographicGroups?: DemographicGroup[];
}
