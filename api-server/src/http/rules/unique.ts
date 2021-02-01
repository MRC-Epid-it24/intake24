import { Op, WhereOptions } from 'sequelize';
import { ModelCtor } from '@/db/models/model';

export type UniqueCondition = {
  field: string;
  value: any;
  ci?: boolean;
};

export type UniqueOptions = {
  model: ModelCtor;
  condition: UniqueCondition;
  except?: WhereOptions;
};

export default async ({ model, condition, except = {} }: UniqueOptions): Promise<void> => {
  const { field, value, ci } = condition;
  const op = ci && model.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

  const where = { [field]: { [op]: value }, ...except };

  const entry = await model.findOne({ where });
  return entry ? Promise.reject(new Error('Current value is already in use.')) : Promise.resolve();
};
