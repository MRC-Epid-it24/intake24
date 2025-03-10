import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Column, CreatedAt, DataType, Table, UpdatedAt } from 'sequelize-typescript';

import type { SinglePrompt } from '@intake24/common/prompts';

import BaseModel from '../model';

@Table({
  modelName: 'SurveySchemePrompt',
  tableName: 'survey_scheme_prompts',
  freezeTableName: true,
  underscored: true,
})
export default class SurveySchemePrompt extends BaseModel<
  InferAttributes<SurveySchemePrompt>,
  InferCreationAttributes<SurveySchemePrompt>
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
  declare promptId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(512),
  })
  declare name: string;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get prompt(): SinglePrompt {
    return JSON.parse(this.getDataValue('prompt') as unknown as string);
  }

  set prompt(value: SinglePrompt) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('prompt', JSON.stringify(value));
  }

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;
}

export type SurveySchemePromptAttributes = Attributes<SurveySchemePrompt>;
export type SurveySchemePromptCreationAttributes = CreationAttributes<SurveySchemePrompt>;
