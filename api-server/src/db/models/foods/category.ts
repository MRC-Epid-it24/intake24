import { Column, DataType, Table } from 'sequelize-typescript';
import BaseModel from '../model';

@Table({
  modelName: 'Category',
  tableName: 'categories',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class Category extends BaseModel {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public code!: string;

  @Column({
    allowNull: false,
  })
  public description!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
  })
  public isHidden!: boolean;

  @Column({
    type: DataType.UUID,
  })
  public version!: string;
}
