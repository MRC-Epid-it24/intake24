import { Op, WhereOptions } from 'sequelize';
import { Request } from 'express';
import { Meta } from 'express-validator';
import { Model } from '@/db/models/model';

export type RuleOptions = {
  model: typeof Model;
  field: string;
  value: any;
};

export default async ({ model, field, value }: RuleOptions, { req }: Meta): Promise<void> => {
  const where: WhereOptions = {};
  where[field] = value;

  const { id } = (req as Request).params;
  if (id) {
    where.id = { [Op.ne]: id };
  }

  const entry = await model.findOne({ where });
  return entry ? Promise.reject(new Error('Current value is already in use.')) : Promise.resolve();
};
