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
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Scopes,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import type { RecordVisibility } from '@intake24/common/security';
import type { ExportSection, RecallPrompts, SchemeType } from '@intake24/common/surveys';
import type { Meal } from '@intake24/common/types';
import { defaultExport, defaultMeals, defaultPrompts } from '@intake24/common/surveys';

import type { HasVisibility } from '..';
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
  extends BaseModel<InferAttributes<SurveyScheme>, InferCreationAttributes<SurveyScheme>>
  implements HasVisibility
{
  @Column({
    autoIncrement: true,
    primaryKey: true,
    type: DataType.BIGINT,
  })
  declare id: CreationOptional<string>;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(256),
  })
  declare name: string;

  @Column({
    allowNull: false,
    defaultValue: 'default',
    type: DataType.STRING(64),
  })
  declare type: CreationOptional<SchemeType>;

  @Column({
    allowNull: true,
    defaultValue: () => JSON.stringify(defaultPrompts),
    type: DataType.TEXT({ length: 'long' }),
  })
  get prompts(): CreationOptional<RecallPrompts> {
    const val = this.getDataValue('prompts') as unknown;
    return val ? JSON.parse(val as string) : defaultPrompts;
  }

  set prompts(value: RecallPrompts) {
    // @ts-expect-error: Sequelize/TS issue for setting custom values
    this.setDataValue('prompts', JSON.stringify(value ?? defaultPrompts));
  }

  @Column({
    allowNull: true,
    defaultValue: () => JSON.stringify(defaultMeals),
    type: DataType.TEXT({ length: 'long' }),
  })
  get meals(): CreationOptional<Meal[]> {
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
  get dataExport(): CreationOptional<ExportSection[]> {
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
  declare ownerId: CreationOptional<string | null>;

  @Column({
    allowNull: false,
    defaultValue: 'public',
    type: DataType.STRING(32),
  })
  declare visibility: CreationOptional<RecordVisibility>;

  @CreatedAt
  declare readonly createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare readonly updatedAt: CreationOptional<Date>;

  @BelongsTo(() => User, 'ownerId')
  declare owner?: NonAttribute<User | null>;

  @HasMany(() => Survey, 'surveySchemeId')
  declare surveys?: NonAttribute<Survey[]>;

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
  declare securableUsers?: NonAttribute<User[]>;

  @HasMany(() => UserSecurable, {
    foreignKey: 'securableId',
    constraints: false,
    scope: { securable_type: 'SurveyScheme' },
  })
  declare securables?: NonAttribute<UserSecurable[]>;
}

export type SurveySchemeAttributes = Attributes<SurveyScheme>;
export type SurveySchemeCreationAttributes = CreationAttributes<SurveyScheme>;

export const updateSurveySchemeFields = ['name', 'type', 'meals', 'visibility'] as const;

export type UpdateSurveySchemeField = (typeof updateSurveySchemeFields)[number];

export const perCardSurveySchemeFields = ['prompts', 'dataExport'] as const;

export type PerCardSurveySchemeField = (typeof perCardSurveySchemeFields)[number];

export const createSurveySchemeFields = [
  ...updateSurveySchemeFields,
  ...perCardSurveySchemeFields,
] as const;

export type CreateSurveySchemeField = (typeof createSurveySchemeFields)[number];
