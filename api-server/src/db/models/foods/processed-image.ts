import { Column, DataType, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import { ImageMap } from '.';

@Scopes(() => ({
  imageMaps: { include: [{ model: ImageMap }] },
}))
@Table({
  modelName: 'ProcessedImage',
  tableName: 'processed_images',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class ProcessedImage extends BaseModel<ProcessedImage> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
  })
  public path!: string;

  @Column({
    allowNull: false,
  })
  public sourceId!: number;

  @Column({
    allowNull: false,
  })
  public purpose!: number;

  @HasMany(() => ImageMap, 'imageMapId')
  public imageMaps?: ImageMap[];
}
