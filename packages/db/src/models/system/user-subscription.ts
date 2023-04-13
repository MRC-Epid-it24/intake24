import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import BaseModel from '../model';
import { User } from '.';

export type SubscriptionType = 'web-push';

export type PushSubscription = {
  endpoint: string;
  expirationTime?: number | Date | null; // TODO: Verify this
  keys: {
    p256dh: string;
    auth: string;
  };
};

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserSubscription',
  tableName: 'user_subscriptions',
  freezeTableName: true,
  underscored: true,
})
export default class UserSubscription extends BaseModel<
  InferAttributes<UserSubscription>,
  InferCreationAttributes<UserSubscription>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  declare userId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  declare type: SubscriptionType;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get subscription(): PushSubscription {
    const val = this.getDataValue('subscription') as unknown;
    return JSON.parse(val as string);
  }

  set subscription(value: PushSubscription) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('subscription', JSON.stringify(value));
  }

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User, 'userId')
  declare user?: NonAttribute<User>;
}

export type UserSubscriptionAttributes = Attributes<UserSubscription>;
export type UserSubscriptionCreationAttributes = CreationAttributes<UserSubscription>;
