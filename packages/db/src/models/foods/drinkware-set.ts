import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import type { LocaleTranslation } from '@intake24/common/types';
import { DrinkwareScale, DrinkwareScaleV2, ImageMap } from '.';
import BaseModel from '../model';

@Scopes(() => ({
  scales: { include: [{ model: DrinkwareScale }] },
}))
@Table({
  modelName: 'DrinkwareSet',
  tableName: 'drinkware_sets',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DrinkwareSet extends BaseModel<
  InferAttributes<DrinkwareSet>,
  InferCreationAttributes<DrinkwareSet>
> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(32),
  })
  declare id: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare description: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare imageMapId: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get label(): CreationOptional<LocaleTranslation> {
    const val = this.getDataValue('label') as unknown as string | null;
    return val ? JSON.parse(val) : {};
  }

  set label(value: LocaleTranslation) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('label', value && Object.keys(value).length ? JSON.stringify(value) : null);
  }

  @BelongsTo(() => ImageMap, 'imageMapId')
  declare imageMap?: NonAttribute<ImageMap>;

  @HasMany(() => DrinkwareScale, 'drinkwareSetId')
  declare scales?: NonAttribute<DrinkwareScale[]>;

  @HasMany(() => DrinkwareScaleV2, 'drinkwareSetId')
  declare scalesV2?: NonAttribute<DrinkwareScale[]>;
}

export type DrinkwareSetAttributes = Attributes<DrinkwareSet>;
export type DrinkwareSetCreationAttributes = CreationAttributes<DrinkwareSet>;
