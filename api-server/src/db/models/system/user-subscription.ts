import {
  BelongsTo,
  Column,
  DataType,
  Scopes,
  CreatedAt,
  UpdatedAt,
  Table,
} from 'sequelize-typescript';
import BaseModel from '@/db/models/model';
import {
  PushSubscription,
  SubscriptionType,
  UserSubscriptionAttributes,
  UserSubscriptionCreationAttributes,
} from '@common/types/models';
import { User } from '.';

@Scopes(() => ({
  user: { include: [{ model: User }] },
}))
@Table({
  modelName: 'UserSubscription',
  tableName: 'user_subscriptions',
  freezeTableName: true,
  underscored: true,
})
export default class UserSubscription
  extends BaseModel<UserSubscriptionAttributes, UserSubscriptionCreationAttributes>
  implements UserSubscriptionAttributes {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: number;

  @Column({
    allowNull: false,
    type: DataType.BIGINT,
  })
  public userId!: number;

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
  })
  public type!: SubscriptionType;

  @Column({
    allowNull: false,
    type: DataType.TEXT({ length: 'long' }),
  })
  get subscription(): PushSubscription {
    const val = this.getDataValue('subscription') as unknown;
    return JSON.parse(val as string);
  }

  set subscription(value: PushSubscription) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setDataValue('subscription', JSON.stringify(value));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'userId')
  public user?: User;
}
