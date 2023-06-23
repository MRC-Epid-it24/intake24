import type {
  Attributes,
  CreationAttributes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';

import BaseModel from '../model';
import { DrinkwareScale, ImageMap } from '.';

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

  @BelongsTo(() => ImageMap, 'imageMapId')
  declare imageMap?: NonAttribute<ImageMap>;

  @HasMany(() => DrinkwareScale, 'drinkwareSetId')
  declare scales?: NonAttribute<DrinkwareScale[]>;
}

export type DrinkwareSetAttributes = Attributes<DrinkwareSet>;
export type DrinkwareSetCreationAttributes = CreationAttributes<DrinkwareSet>;
