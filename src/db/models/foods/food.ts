import { Column, DataType, Table } from 'sequelize-typescript';
import BaseModel from '../model';

@Table({
  timestamps: false,
  underscored: true,
})
export default class Food extends BaseModel<Food> {
  @Column({
    primaryKey: true,
  })
  public code!: string;

  @Column
  public description!: string;

  @Column
  public foodGroupId!: number;

  @Column({
    type: DataType.UUID,
  })
  public version!: string;
}
