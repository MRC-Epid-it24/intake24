import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import {
  DemographicGroupScaleSectorAttributes,
  DemographicGroupScaleSectorCreationAttributes,
  Sentiment,
} from '@intake24/common/types/models/foods';
import BaseModel from '../model';
import { DemographicGroup } from '.';

@Table({
  modelName: 'DemographicGroupScaleSector',
  tableName: 'demographic_group_scale_sectors',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class DemographicGroupScaleSector
  extends BaseModel<
    DemographicGroupScaleSectorAttributes,
    DemographicGroupScaleSectorCreationAttributes
  >
  implements DemographicGroupScaleSectorAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public demographicGroupId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  public name!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  public description!: string | null;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public sentiment!: Sentiment;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public minRange!: number;

  @Column({
    allowNull: false,
    type: DataType.DOUBLE,
  })
  public maxRange!: number;

  @BelongsTo(() => DemographicGroup, 'demographicGroupId')
  public demographicGroup?: DemographicGroup;
}
