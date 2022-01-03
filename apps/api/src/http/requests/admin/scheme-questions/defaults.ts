import { Request } from 'express';
import { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';
import { Op, WhereOptions } from 'sequelize';
import { SchemeQuestion } from '@api/db';

const defaults: Schema = {
  question: {
    in: ['body'],
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { schemeQuestionId } = (req as Request).params;
        const except: WhereOptions = schemeQuestionId ? { id: { [Op.ne]: schemeQuestionId } } : {};

        if (
          !isPlainObject(value) ||
          ['id', 'name', 'type', 'component', 'props'].some((key) => !(key in value)) ||
          ['id', 'name', 'type', 'component'].some((key) => typeof value[key] !== 'string')
        )
          throw new Error('Invalid scheme question properties.');

        const questions = await SchemeQuestion.findAll({ where: except });
        const match = questions.find((q) => q.question.id === value.id);
        if (match) throw new Error(`Scheme question ID (${value.id}) already used.`);

        Promise.resolve();
      },
    },
  },
};

export default defaults;
