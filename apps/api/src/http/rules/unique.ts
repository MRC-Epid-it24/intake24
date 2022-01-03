import { Op, FindOptions } from 'sequelize';
import { BaseModel, ModelCtor, ModelStatic } from '@api/db';
import { merge } from '@common/util';

export type UniqueCondition = {
  field: string;
  value: any;
  ci?: boolean;
};

export type UniqueOptions<TAttributes = any> = {
  model: ModelStatic;
  condition: UniqueCondition;
  options?: FindOptions<TAttributes>;
};

export default async ({ model, condition, options = {} }: UniqueOptions): Promise<void> => {
  const mergedCondition = { ci: true, ...condition };

  const cModel = model as ModelCtor<BaseModel>;

  const { field, value, ci } = mergedCondition;
  const op = ci && cModel.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

  const findOptions: FindOptions = merge(options, { where: { [field]: { [op]: value } } });

  const entry = await cModel.findOne(findOptions);
  if (entry) throw new Error('Current value is already in use.');

  Promise.resolve();
};
