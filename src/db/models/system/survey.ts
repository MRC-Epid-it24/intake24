import { Column, HasMany, Scopes, Table } from 'sequelize-typescript';
import BaseModel from '../model';
import UserSurveyAlias from './user-survey-alias';

@Scopes(() => ({
  respodents: { include: [{ model: UserSurveyAlias }] },
}))
@Table({
  timestamps: false,
  underscored: true,
})
export default class Survey extends BaseModel<Survey> {
  @Column({
    primaryKey: true,
  })
  public id!: string;

  @Column({
    allowNull: false,
  })
  public state!: number;

  @Column({
    allowNull: false,
  })
  public startDate!: Date;

  @Column({
    allowNull: false,
  })
  public endDate!: Date;

  @Column({
    allowNull: false,
  })
  public schemeId!: string;

  @Column({
    allowNull: false,
  })
  public locale!: string;

  @Column({
    allowNull: false,
  })
  public allowGenUsers!: boolean;

  @HasMany(() => UserSurveyAlias, 'surveyId')
  public respodents?: UserSurveyAlias[];
}
