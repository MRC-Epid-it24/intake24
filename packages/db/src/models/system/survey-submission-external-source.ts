import type {
  Attributes,
  CreationAttributes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';

import type { ExternalSource } from '@intake24/common/prompts';

import BaseModel from '../model';
import {
  SurveySubmissionFood,
  SurveySubmissionMissingFood,
} from '.';

@Table({
  modelName: 'SurveySubmissionExternalSource',
  tableName: 'survey_submission_external_sources',
  freezeTableName: true,
  timestamps: false,
  underscored: true,
})
export default class SurveySubmissionExternalSource extends BaseModel<
  InferAttributes<SurveySubmissionExternalSource>,
  InferCreationAttributes<SurveySubmissionExternalSource>
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
  })
  declare id: string;

  @Column({
    allowNull: true,
    type: DataType.UUID,
    unique: 'survey_submission_external_sources_unique',
  })
  declare foodId: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
    unique: 'survey_submission_external_sources_unique',
  })
  declare foodType: 'food' | 'missing-food';

  @Column({
    allowNull: false,
    type: DataType.STRING(64),
    unique: 'survey_submission_external_sources_unique',
  })
  declare source: ExternalSource;

  @Column({
    allowNull: true,
    type: DataType.STRING(256),
  })
  declare searchTerm: CreationOptional<string | null>;

  @Column({
    allowNull: true,
    type: DataType.STRING(64),
  })
  declare type: CreationOptional<'selected' | 'missing' | null>;

  @Column({
    allowNull: true,
    type: DataType.TEXT({ length: 'long' }),
  })
  get data(): CreationOptional<object> {
    const val = this.getDataValue('data') as unknown;
    return val ? JSON.parse(val as string) : null;
  }

  set data(value: object) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('data', JSON.stringify(value ?? null));
  }

  @BelongsTo(() => SurveySubmissionFood, { foreignKey: 'foodId', constraints: false })
  declare food?: NonAttribute<SurveySubmissionFood>;

  @BelongsTo(() => SurveySubmissionMissingFood, { foreignKey: 'foodId', constraints: false })
  declare missingFood?: NonAttribute<SurveySubmissionMissingFood>;
}

export type SurveySubmissionExternalSourceAttributes = Attributes<SurveySubmissionExternalSource>;
export type SurveySubmissionExternalSourceCreationAttributes = CreationAttributes<SurveySubmissionExternalSource>;
