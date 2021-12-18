import { Column, DataType, Table } from 'sequelize-typescript';
import {
  AttributeDefaultsAttributes,
  AttributeDefaultsCreationAttributes,
} from '@common/types/models';
import BaseModel from '../model';

@Table({
  modelName: 'AttributeDefaults',
  tableName: 'attribute_defaults',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class AttributeDefaults
  extends BaseModel<AttributeDefaultsAttributes, AttributeDefaultsCreationAttributes>
  implements AttributeDefaultsAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public sameAsBeforeOption!: boolean;

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public readyMealOption!: boolean;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public reasonableAmount!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  public useInRecipes!: number;
}
