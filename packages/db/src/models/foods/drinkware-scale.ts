import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { DrinkwareSet, DrinkwareVolumeSample } from '.';

@Scopes(() => ({
  drinkwareSet: { include: [{ model: DrinkwareSet }] },
  volumeSamples: { include: [{ model: DrinkwareVolumeSample }] },
}))
@Table({
  modelName: 'DrinkwareScale',
  tableName: 'drinkware_scales',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareScale extends BaseModel<
  InferAttributes<DrinkwareScale>,
  InferCreationAttributes<DrinkwareScale>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare drinkwareSetId: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare width: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare height: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare emptyLevel: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare fullLevel: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare choiceId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare baseImageUrl: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare overlayImageUrl: string;

  @BelongsTo(() => DrinkwareSet, 'drinkwareSetId')
  declare drinkwareSet?: NonAttribute<DrinkwareSet>;

  @HasMany(() => DrinkwareVolumeSample, 'drinkwareScaleId')
  declare volumeSamples?: NonAttribute<DrinkwareVolumeSample[]>;
}

export type DrinkwareScaleAttributes = Attributes<DrinkwareScale>;
export type DrinkwareScaleCreationAttributes = CreationAttributes<DrinkwareScale>;
