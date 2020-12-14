import { BelongsTo, Column, ForeignKey, HasMany, Scopes, Table } from 'sequelize-typescript';
import { NutrientType as NutrientTypeAttributes } from '@common/types/models/system';
import BaseModel from '../model';
import { LocalNutrientType, NutrientUnit } from '.';

@Scopes(() => ({
  localNutrientTypes: { include: [{ model: LocalNutrientType }] },
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
  extends BaseModel<NutrientType>
  implements NutrientTypeAttributes {
  @Column({
    autoIncrement: true,
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
  @ForeignKey(() => NutrientUnit)
  public unitId!: number;

  @HasMany(() => LocalNutrientType, 'nutrientTypeId')
  public localNutrientTypes?: LocalNutrientType[];

  @BelongsTo(() => NutrientUnit, 'unitId')
  public unit?: NutrientUnit;
}
