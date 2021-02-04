import { Column, DataType, Table } from 'sequelize-typescript';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
  tableName: 'categories',
})
export default class Category extends BaseModel<Category> {
  @Column({
    allowNull: false,
    primaryKey: true,
  })
  public code!: string;

  @Column({
    allowNull: false
  })
  public description!: string;

  @Column({
    allowNull: false,
    defaultValue: false
  })
  public isHidden!: boolean;

  @Column({
    type: DataType.UUID,
  })
  public version!: string;
}
