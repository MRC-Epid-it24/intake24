import { BelongsTo, Column, ForeignKey, Scopes, Table } from 'sequelize-typescript';
import { LocalNutrientType as LocalNutrientTypeAttributes } from '@common/types/models/system';
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
  extends BaseModel<LocalNutrientType>
  implements LocalNutrientTypeAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  public id!: number;

  @Column({
    allowNull: false,
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
