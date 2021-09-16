import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  FoodLocal,
  NutrientMapping,
  NutrientTable,
  NutrientTableRecordField,
  NutrientTableRecordNutrient,
} from '@api-server/db/models/foods';
import {
  NutrientTableRecordAttributes,
  NutrientTableRecordCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'NutrientTableRecord',
  tableName: 'nutrient_table_records',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class NutrientTableRecord extends BaseModel<
  NutrientTableRecordAttributes,
  NutrientTableRecordCreationAttributes
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public nutrientTableId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public nutrientTableRecordId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public localName!: string | null;

  @BelongsTo(() => NutrientTable, 'nutrientTableId')
  public nutrientTable?: NutrientTable;

  @HasMany(() => NutrientMapping, 'nutrientTableRecordId')
  public mappings?: NutrientMapping[];

  @HasMany(() => NutrientTableRecordNutrient, 'nutrientTableRecordId')
  public nutrients?: NutrientTableRecordNutrient[];

  @HasMany(() => NutrientTableRecordField, 'nutrientTableRecordId')
  public fields?: NutrientTableRecordField[];

  @BelongsToMany(() => FoodLocal, () => NutrientMapping)
  public foods?: FoodLocal[];

  getNutrientByType(nutrientTypeId: string): NutrientTableRecordNutrient | undefined {
    return this.nutrients?.find((nutrient) => nutrient.nutrientTypeId === nutrientTypeId);
  }
}
