import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { NutrientTypeAttributes, NutrientUnitCreationAttributes } from '@common/types/models';
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
  extends BaseModel<NutrientTypeAttributes, NutrientUnitCreationAttributes>
  implements NutrientTypeAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
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
