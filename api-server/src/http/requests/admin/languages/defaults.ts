import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Language } from '@/db/models/system';
import unique from '@/http/rules/unique';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: 'Enter unique english name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { languageId } = (req as Request).params;
        const except: WhereOptions = languageId ? { id: { [Op.ne]: languageId } } : {};

        return unique({ model: Language, condition: { field: 'englishName', value }, except });
      },
    },
  },
  localName: {
    in: ['body'],
    errorMessage: 'Enter unique local name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { languageId } = (req as Request).params;
        const except: WhereOptions = languageId ? { id: { [Op.ne]: languageId } } : {};

        return unique({ model: Language, condition: { field: 'localName', value }, except });
      },
    },
  },
  countryFlagCode: {
    in: ['body'],
    errorMessage: 'Enter valid locale code.',
    isLocale: true,
  },
};

export default defaults;
