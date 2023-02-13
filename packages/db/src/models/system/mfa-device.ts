import {
  BeforeCreate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DefaultScope,
  HasOne,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { MFAProvider } from '@intake24/common/security';
import type {
  MFADeviceAttributes,
  MFADeviceCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { MFAAuthenticator, User } from '.';

@DefaultScope(() => ({
  attributes: { exclude: ['secret'] },
}))
@Table({
  modelName: 'MFADevice',
  tableName: 'mfa_devices',
  freezeTableName: true,
  underscored: true,
})
export default class MFADevice
  extends BaseModel<MFADeviceAttributes, MFADeviceCreationAttributes>
  implements MFADeviceAttributes
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
  public userId!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public provider!: MFAProvider;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  public secret!: string;

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  public preferred!: boolean;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;

  @HasOne(() => MFAAuthenticator, 'deviceId')
  public authenticator?: MFAAuthenticator;

  @BeforeCreate
  static async handleAdminPermission(device: MFADevice): Promise<void> {
    const count = await MFADevice.count({ where: { userId: device.userId } });
    if (count === 0) device.preferred = true;
  }
}
