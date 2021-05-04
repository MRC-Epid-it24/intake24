import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { isPlainObject } from 'lodash';
import { SchemeQuestion } from '@/db/models/system';
import { unique } from '@/http/rules';

const defaults: Schema = {
  name: {
    in: ['body'],
    errorMessage: 'Question name must be unique string.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { schemeQuestionId } = (req as Request).params;
        const except: WhereOptions = schemeQuestionId ? { id: { [Op.ne]: schemeQuestionId } } : {};

        return unique({ model: SchemeQuestion, condition: { field: 'name', value }, except });
      },
    },
  },
  prompt: {
    in: ['body'],
    errorMessage: 'Invalid scheme question properties.',
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { schemeQuestionId } = (req as Request).params;
        const except: WhereOptions = schemeQuestionId ? { id: { [Op.ne]: schemeQuestionId } } : {};

        console.log(typeof value);
        if (
          !isPlainObject(value) ||
          ['id', 'name', 'type', 'component', 'props'].some((key) => !(key in value))
        )
          throw new Error('Invalid scheme question properties.');

        const questions = await SchemeQuestion.findAll({ where: except });
        const match = questions.find((question) => question.prompt.id === value.id);
        if (match) throw new Error(`Scheme question ID (${value.id}) already used.`);

        Promise.resolve();
      },
    },
  },
};

export default defaults;
