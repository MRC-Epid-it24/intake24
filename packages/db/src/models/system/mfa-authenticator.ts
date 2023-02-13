import { BelongsTo, Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type {
  MFAAuthenticatorAttributes,
  MFAAuthenticatorCreationAttributes,
} from '@intake24/common/types/models';

import BaseModel from '../model';
import { MFADevice } from '.';

@Table({
  modelName: 'MFAAuthenticator',
  tableName: 'mfa_authenticators',
  freezeTableName: true,
  underscored: true,
})
export default class MFAAuthenticator
  extends BaseModel<MFAAuthenticatorAttributes, MFAAuthenticatorCreationAttributes>
  implements MFAAuthenticatorAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.STRING(512),
  })
  public id!: string;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
    unique: true,
  })
  public deviceId!: string;

  @Column({
    allowNull: false,
    type: DataType.BLOB({ length: 'long' }),
  })
  get publicKey(): Uint8Array {
    return new Uint8Array(this.getDataValue('publicKey'));
  }

  set publicKey(value: Uint8Array) {
    this.setDataValue('publicKey', Buffer.from(value));
  }

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public counter!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public deviceType!: MFAAuthenticatorAttributes['deviceType'];

  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
  public backedUp!: boolean;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  get transports(): MFAAuthenticatorAttributes['transports'] {
    const val = this.getDataValue('transports') as unknown;
    return val ? JSON.parse(val as string) : [];
  }

  set transports(value: MFAAuthenticatorAttributes['transports']) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('transports', JSON.stringify(value ?? []));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => MFADevice, 'deviceId')
  public device?: MFADevice;

  getIdBuffer(): Buffer {
    return Buffer.from(this.id, 'base64url');
  }
}
