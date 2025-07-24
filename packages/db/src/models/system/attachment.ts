import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, DataType, Table } from 'sequelize-typescript';

import BaseModel from '../model';

@Table({
  modelName: 'Attachment',
  tableName: 'attachments',
  freezeTableName: true,
  underscored: true,
})
export default class Attachment extends BaseModel<
  InferAttributes<Attachment>,
  InferCreationAttributes<Attachment>
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  declare attachableId: string;

  @Column({
    allowNull: true,
    type: DataType.UUID,
  })
  declare attachableUuid: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  declare attachableType: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  declare mimetype: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare size: number;

  @Column({
    allowNull: false,
    type: DataType.BLOB({ length: 'long' }),
  })
  declare data: Buffer;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare readonly createdAt: CreationOptional<Date>;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare readonly updatedAt: CreationOptional<Date>;
}

export type AttachmentAttributes = Attributes<Attachment>;
export type AttachmentCreationAttributes = CreationAttributes<Attachment>;
