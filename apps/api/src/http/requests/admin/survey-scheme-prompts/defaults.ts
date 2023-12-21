import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { isPlainObject } from 'lodash';

import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage } from '@intake24/api/http/requests/util';
import { Op, SurveySchemePrompt } from '@intake24/db';

const defaults: Schema = {
  prompt: {
    in: ['body'],
    custom: {
      options: async (value, meta): Promise<void> => {
        const { surveySchemePromptId } = (meta.req as Request).params;
        const except: WhereOptions = surveySchemePromptId
          ? { id: { [Op.ne]: surveySchemePromptId } }
          : {};

        if (
          !isPlainObject(value) ||
          ['id', 'name', 'type', 'component'].some(
            (key) => !(key in value) || typeof value[key] !== 'string'
          )
        )
          throw new Error(customTypeErrorMessage('structure._', meta));

        const prompts = await SurveySchemePrompt.findAll({
          attributes: ['id', 'prompt'],
          where: except,
        });
        const match = prompts.find((p) => p.prompt.id === value.id);
        if (match) throw new Error(`Scheme prompt ID (${value.id}) already used.`);
      },
    },
  },
};

export default defaults;
