import { BelongsTo, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  DemographicGroupAttributes,
  DemographicGroupCreationAttributes,
  NutrientRuleType,
} from '@common/types/models/foods';
import { Sex } from '@common/types/models';
import BaseModel from '../model';
import { DemographicGroupScaleSector, NutrientType, PhysicalActivityLevel } from '.';

@Table({
  modelName: 'DemographicGroup',
  tableName: 'demographic_groups',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DemographicGroup
  extends BaseModel<DemographicGroupAttributes, DemographicGroupCreationAttributes>
  implements DemographicGroupAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public minAge!: number | null;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  public maxAge!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public minHeight!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public maxHeight!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public minWeight!: number | null;

  @Column({
    allowNull: true,
    type: DataType.DOUBLE,
  })
  public maxWeight!: number | null;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  public sex!: Sex | null;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public physicalActivityLevelId!: string | null;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public nutrientTypeId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public nutrientRuleType!: NutrientRuleType;

  @BelongsTo(() => PhysicalActivityLevel, 'physicalActivityLevelId')
  public physicalActivityLevel?: PhysicalActivityLevel;

  @BelongsTo(() => NutrientType, 'nutrientTypeId')
  public nutrientType?: NutrientType;

  @HasMany(() => DemographicGroupScaleSector, 'demographicGroupId')
  public scaleSectors?: DemographicGroupScaleSector[];
}
