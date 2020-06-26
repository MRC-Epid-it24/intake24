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
  const { id } = (req as Request).params;
  const where: WhereOptions = {};

  switch (true) {
    case id && field === 'id':
      where[field] = { [Op.eq]: value, [Op.ne]: id };
      break;
    case !!id:
      where[field] = { [Op.eq]: value };
      where.id = { [Op.ne]: id };
      break;
    default:
      where[field] = { [Op.eq]: value };
      break;
  }

  const entry = await model.findOne({ where });
  return entry ? Promise.reject(new Error('Current value is already in use.')) : Promise.resolve();
};
