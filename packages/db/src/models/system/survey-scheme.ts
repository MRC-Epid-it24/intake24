import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { ExportSection, RecallQuestions, SchemeType } from '@intake24/common/schemes';
import type { Meal } from '@intake24/common/types';
import type {
  SurveySchemeAttributes,
  SurveySchemeCreationAttributes,
} from '@intake24/common/types/models';
import { defaultExport, defaultMeals, defaultQuestions } from '@intake24/common/schemes';

import type { Securable } from '..';
import { BaseModel } from '..';
import { Survey, User, UserSecurable } from '.';

@Scopes(() => ({
  list: { attributes: ['id', 'name'], order: [['name', 'ASC']] },
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
  implements SurveySchemeAttributes, Securable
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
    defaultValue: 'default',
    type: DataType.STRING(64),
  })
  public type!: SchemeType;

  @Column({
    allowNull: true,
    defaultValue: () => JSON.stringify(defaultQuestions),
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
    defaultValue: () => JSON.stringify(defaultMeals),
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
    defaultValue: () => JSON.stringify(defaultExport),
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

  @Column({
    allowNull: true,
    type: DataType.BIGINT,
  })
  public ownerId!: string | null;

  @CreatedAt
  @Column
  public readonly createdAt!: Date;

  @UpdatedAt
  @Column
  public readonly updatedAt!: Date;

  @BelongsTo(() => User, 'ownerId')
  public owner?: User | null;

  @HasMany(() => Survey, 'surveySchemeId')
  public surveys?: Survey[];

  @BelongsToMany(() => User, {
    through: {
      model: () => UserSecurable,
      unique: false,
      scope: {
        securable_type: 'SurveyScheme',
      },
    },
    foreignKey: 'securableId',
    otherKey: 'userId',
    constraints: false,
  })
  public securableUsers?: User[];

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'SurveyScheme' },
  })
  public securables?: UserSecurable[];
}
