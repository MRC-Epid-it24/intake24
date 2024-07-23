import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';

import BaseModel from '../model';
import { DrinkwareSet, ProcessedImage } from '.';

@Scopes(() => ({
  drinkwareSet: { include: [{ model: DrinkwareSet }] },
}))
@Table({
  modelName: 'DrinkwareScaleV2',
  tableName: 'drinkware_scales_v2',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareScaleV2 extends BaseModel<
  InferAttributes<DrinkwareScaleV2>,
  InferCreationAttributes<DrinkwareScaleV2>
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
    type: DataType.BIGINT,
  })
  declare choiceId: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare baseImageId: string;

  @BelongsTo(() => ProcessedImage, 'baseImageId')
  declare baseImage?: NonAttribute<ProcessedImage>;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get label(): LocaleTranslation {
    const val = this.getDataValue('label') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set label(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('label', JSON.stringify(value ?? {}));
  }

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare outlineCoordinates: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare volumeSamples: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare volumeSamplesNormalised: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
    defaultValue: 'lookUpTable',
  })
  declare volumeMethod: string;

  @BelongsTo(() => DrinkwareSet, 'drinkwareSetId')
  declare drinkwareSet?: NonAttribute<DrinkwareSet>;
}

export type DrinkwareScaleV2Attributes = Attributes<DrinkwareScaleV2>;
export type DrinkwareScaleV2CreationAttributes = CreationAttributes<DrinkwareScaleV2>;
