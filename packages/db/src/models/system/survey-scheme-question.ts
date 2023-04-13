import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { Prompt } from '@intake24/common/prompts';

import BaseModel from '../model';

@Table({
  modelName: 'SurveySchemeQuestion',
  tableName: 'survey_scheme_questions',
  freezeTableName: true,
  underscored: true,
})
export default class SurveySchemeQuestion extends BaseModel<
  InferAttributes<SurveySchemeQuestion>,
  InferCreationAttributes<SurveySchemeQuestion>
> {
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    type: DataType.STRING(128),
  })
  declare questionId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get question(): Prompt {
    const val = this.getDataValue('question') as unknown;
    return val ? JSON.parse(val as string) : {};
  }

  set question(value: Prompt) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('question', JSON.stringify(value ?? {}));
  }

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;
}

export type SurveySchemeQuestionAttributes = Attributes<SurveySchemeQuestion>;
export type SurveySchemeQuestionCreationAttributes = CreationAttributes<SurveySchemeQuestion>;
