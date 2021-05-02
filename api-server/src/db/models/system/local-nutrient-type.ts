import { BelongsTo, Column, DataType, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import {
  LocalNutrientTypeAttributes,
  LocalNutrientTypeCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';
import { Locale, NutrientType } from '.';

@Scopes(() => ({
  locale: { include: [{ model: Locale }] },
  nutrientType: { include: [{ model: NutrientType }] },
}))
@Table({
  modelName: 'LocalNutrientType',
  tableName: 'local_nutrient_types',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class LocalNutrientType
  extends BaseModel<LocalNutrientTypeAttributes, LocalNutrientTypeCreationAttributes>
  implements LocalNutrientTypeAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(16),
  })
  @ForeignKey(() => Locale)
  public localeId!: string;

  @Column({
    allowNull: false,
  })
  @ForeignKey(() => NutrientType)
  public nutrientTypeId!: number;

  @BelongsTo(() => Locale, 'localeId')
  public locale?: Locale;

  @BelongsTo(() => NutrientType, 'nutrientTypeId')
  public nutrientType?: NutrientType;
}
