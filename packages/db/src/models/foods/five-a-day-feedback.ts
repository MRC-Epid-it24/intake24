import { Column, DataType, Table } from 'sequelize-typescript';
import { FiveADayFeedbackAttributes } from '@intake24/common/types/models/foods';
import BaseModel from '../model';

@Table({
  modelName: 'FiveADayFeedback',
  tableName: 'five_a_day_feedback',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class FiveADayFeedback
  extends BaseModel<FiveADayFeedbackAttributes>
  implements FiveADayFeedbackAttributes
{
  @Column({
    primaryKey: true,
    type: DataType.TEXT,
  })
  public tellMeMoreText!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(512),
  })
  public tooLowMessage!: string | null;
}
