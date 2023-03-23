import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage } from '@intake24/api/http/requests/util';
import { Op, SurveySchemeQuestion } from '@intake24/db';

const defaults: Schema = {
  question: {
    in: ['body'],
    custom: {
      options: async (value, meta): Promise<void> => {
        const { surveySchemeQuestionId } = (meta.req as Request).params;
        const except: WhereOptions = surveySchemeQuestionId
          ? { id: { [Op.ne]: surveySchemeQuestionId } }
          : {};

        if (
          !isPlainObject(value) ||
          ['id', 'name', 'type', 'component'].some(
            (key) => !(key in value) || typeof value[key] !== 'string'
          )
        )
          throw new Error(customTypeErrorMessage('structure._', meta));

        const questions = await SurveySchemeQuestion.findAll({ where: except });
        const match = questions.find((q) => q.question.id === value.id);
        if (match) throw new Error(`Scheme question ID (${value.id}) already used.`);
      },
    },
  },
};

export default defaults;
