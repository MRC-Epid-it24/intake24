import { Column, CreatedAt, DataType, ForeignKey, Table, UpdatedAt } from 'sequelize-typescript';

import type { SecurableType } from '@intake24/common/security';
import type {
  UserSecurableAttributes,
  UserSecurableCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { User } from '.';

@Table({
  modelName: 'UserSecurable',
  tableName: 'user_securables',
  freezeTableName: true,
  underscored: true,
})
export default class UserSecurable
  extends BaseModel<UserSecurableAttributes, UserSecurableCreationAttributes>
  implements UserSecurableAttributes
{
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public userId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public securableId!: string;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public securableType!: SecurableType;

  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataType.STRING(64),
  })
  public action!: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT,
  })
  get fields(): string[] | null {
    const val = this.getDataValue('fields') as unknown;
    return val ? JSON.parse(val as string) : null;
  }

  set fields(value: string[] | null) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('fields', value ? JSON.stringify(value) : null);
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;
}
