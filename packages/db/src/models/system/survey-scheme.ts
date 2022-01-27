import {
  Column,
  DataType,
  HasMany,
  Scopes,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Meal } from '@intake24/common/types';
import {
  SurveySchemeAttributes,
  SurveySchemeCreationAttributes,
  ExportSection,
} from '@intake24/common/types/models';
import {
  defaultExport,
  defaultMeals,
  defaultQuestions,
  RecallQuestions,
  SchemeType,
} from '@intake24/common/schemes';
import BaseModel from '../model';
import { Survey } from '.';

@Scopes(() => ({
  list: { attributes: ['id', 'name'] },
  surveys: { include: [{ model: Survey }] },
}))
@Table({
  modelName: 'SurveyScheme',
  tableName: 'survey_schemes',
  freezeTableName: true,
  underscored: true,
})
export default class SurveyScheme
  extends BaseModel<SurveySchemeAttributes, SurveySchemeCreationAttributes>
  implements SurveySchemeAttributes
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  public id!: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(256),
  })
  public name!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
  })
  public type!: SchemeType;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get questions(): RecallQuestions {
    const val = this.getDataValue('questions') as unknown;
    return val ? JSON.parse(val as string) : defaultQuestions;
  }

  set questions(value: RecallQuestions) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('questions', JSON.stringify(value ?? defaultQuestions));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get meals(): Meal[] {
    const val = this.getDataValue('meals') as unknown;
    return val ? JSON.parse(val as string) : defaultMeals;
  }

  set meals(value: Meal[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('meals', JSON.stringify(value ?? defaultMeals));
  }

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get dataExport(): ExportSection[] {
    const val = this.getDataValue('dataExport') as unknown;
    return val ? JSON.parse(val as string) : defaultExport;
  }

  set dataExport(value: ExportSection[]) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('dataExport', JSON.stringify(value ?? defaultExport));
  }

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @HasMany(() => Survey, 'surveySchemeId')
  public surveys?: Survey[];
}
