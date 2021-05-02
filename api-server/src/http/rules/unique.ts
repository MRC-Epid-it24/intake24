import { Op, WhereOptions } from 'sequelize';
import Model, { ModelCtor, ModelStatic } from '@/db/models/model';

export type UniqueCondition = {
  field: string;
  value: any;
  ci?: boolean;
};

export type UniqueOptions = {
  model: ModelStatic;
  condition: UniqueCondition;
  except?: WhereOptions;
};

export default async ({ model, condition, except = {} }: UniqueOptions): Promise<void> => {
  const mergedCondition = { ci: true, ...condition };

  const cModel = model as ModelCtor<Model>;

  const { field, value, ci } = mergedCondition;
  const op = ci && cModel.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

  const where: WhereOptions = { [field]: { [op]: value }, ...except };

  const entry = await cModel.findOne({ where });
  if (entry) throw new Error('Current value is already in use.');

  Promise.resolve();
};
