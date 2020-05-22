import { BelongsTo, Column, DataType, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import Survey from './survey';
import User from './user';

@Scopes(() => ({
  survey: { include: [{ model: Survey }] },
  user: { include: [{ model: User }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class SurveySubmission extends BaseModel<SurveySubmission> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public surveyId!: string;

  @Column({
    allowNull: false,
  })
  public userId!: number;

  @Column({
    allowNull: false,
  })
  public startTime!: Date;

  @Column({
    allowNull: false,
  })
  public endTime!: Date;

  @Column
  public log!: string;

  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public ux_session_id!: string;

  @BelongsTo(() => Survey, 'surveyId')
  public survey?: Survey[];

  @BelongsTo(() => User, 'userId')
  public user?: User[];
}
