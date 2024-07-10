import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { pick } from 'lodash';
import { col, fn, Op } from 'sequelize';

import type { ExportField, ExportSectionId } from '@intake24/common/surveys';
import type { PaginateOptions } from '@intake24/db';
import { ForbiddenError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { surveySchemeResponse } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import { SurveySchemeExportRefs } from '@intake24/common/types/http/admin';
import { kebabCase } from '@intake24/common/util';
import {
  createSurveySchemeFields,
  perCardSurveySchemeFields,
  securableScope,
  SurveyScheme,
  SurveySchemePrompt,
  updateSurveySchemeFields,
  UserSecurable,
} from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { surveySchemeId, req }: { surveySchemeId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = surveySchemeId ? { id: { [Op.ne]: surveySchemeId } } : {};

  if (!(await unique({ model: SurveyScheme, condition: { field: 'name', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'name' }), {
      path: 'name',
    });
  }
}

export function surveyScheme() {
  return initServer().router(contract.admin.surveyScheme, {
    browse: {
      middleware: [permission('survey-schemes')],
      handler: async ({ query, req }) => {
        const {
          aclService,
          user: { userId },
        } = req.scope.cradle;

        const paginateOptions: PaginateOptions = {
          query,
          columns: ['name'],
          order: [[fn('lower', col('SurveyScheme.name')), 'ASC']],
        };

        if (await aclService.hasPermission('survey-schemes|browse')) {
          const surveySchemes = await SurveyScheme.paginate(paginateOptions);
          return { status: 200, body: surveySchemes };
        }

        const surveySchemes = await SurveyScheme.paginate({
          ...paginateOptions,
          where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
          ...securableScope(userId),
          subQuery: false,
        });

        return { status: 200, body: surveySchemes };
      },
    },
    store: {
      middleware: [permission('survey-schemes', 'survey-schemes|create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.name, { req });

        const surveyScheme = await SurveyScheme.create({ ...body, ownerId: req.scope.cradle.user.userId });

        return { status: 201, body: surveySchemeResponse(surveyScheme) };
      },
    },
    refs: {
      middleware: [permission('survey-schemes')],
      handler: async () => {
        const prompts = await SurveySchemePrompt.findAll({ attributes: ['prompt'] });

        const templates = prompts.map(({ prompt }) => prompt);

        return { status: 200, body: { templates } };
      },
    },
    read: {
      middleware: [permission('survey-schemes')],
      handler: async ({ params: { surveySchemeId }, req }) => {
        const surveyScheme = await req.scope.cradle.aclService.findAndCheckRecordAccess(SurveyScheme, 'read', {
          where: { id: surveySchemeId },
        });

        return { status: 200, body: surveySchemeResponse(surveyScheme) };
      },
    },
    edit: {
      middleware: [permission('survey-schemes')],
      handler: async ({ params: { surveySchemeId }, req }) => {
        const surveyScheme = await req.scope.cradle.aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
          where: { id: surveySchemeId },
        });

        return { status: 200, body: surveySchemeResponse(surveyScheme) };
      },
    },
    patch: {
      middleware: [permission('survey-schemes')],
      handler: async ({ body, params: { surveySchemeId }, req }) => {
        await uniqueMiddleware(body.name, { surveySchemeId, req });

        const {
          aclService,
          user: { userId },
        } = req.scope.cradle;

        const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
          where: { id: surveySchemeId },
        });

        const keysToUpdate: string[] = [];
        const [resourceActions, securableActions] = await Promise.all([
          aclService.getResourceAccessActions('survey-schemes'),
          aclService.getSecurableAccessActions(surveyScheme),
        ]);

        if (resourceActions.includes('edit') || surveyScheme.ownerId === userId) {
          keysToUpdate.push(...createSurveySchemeFields);
        }
        else {
          if (securableActions.includes('edit'))
            keysToUpdate.push(...updateSurveySchemeFields);

          perCardSurveySchemeFields.forEach((item) => {
            if (securableActions.includes(kebabCase(item)))
              keysToUpdate.push(item);
          });
        }

        const updateInput = pick(req.body, keysToUpdate);
        if (!Object.keys(updateInput).length)
          throw new ValidationError('Missing body');

        await surveyScheme.update(updateInput);

        return { status: 200, body: surveySchemeResponse(surveyScheme) };
      },
    },
    put: {
      middleware: [permission('survey-schemes')],
      handler: async ({ body, params: { surveySchemeId }, req }) => {
        await uniqueMiddleware(body.name, { surveySchemeId, req });

        const surveyScheme = await req.scope.cradle.aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
          where: { id: surveySchemeId },
        });

        await surveyScheme.update(body);

        return { status: 200, body: surveySchemeResponse(surveyScheme) };
      },
    },
    destroy: {
      middleware: [permission('survey-schemes')],
      handler: async ({ params: { surveySchemeId }, req }) => {
        const surveyScheme = await req.scope.cradle.aclService.findAndCheckRecordAccess(SurveyScheme, 'delete', {
          attributes: ['id'],
          where: { id: surveySchemeId },
          include: [{ association: 'surveys', attributes: ['id'] }],
        });
        const { id: securableId, surveys } = surveyScheme;

        if (!surveys || surveys.length)
          throw new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.');

        await Promise.all([
          UserSecurable.destroy({ where: { securableId, securableType: 'SurveyScheme' } }),
          surveyScheme.destroy(),
        ]);

        return { status: 204, body: undefined };
      },
    },
    copy: {
      middleware: [permission('survey-schemes')],
      handler: async ({ body, params: { surveySchemeId }, req }) => {
        await uniqueMiddleware(body.name, { req });

        const {
          aclService,
          user: { userId },
        } = req.scope.cradle;

        const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'copy', {
          where: { id: surveySchemeId },
        });

        const { name } = body;
        const { type, version, visibility, prompts, meals, dataExport } = surveyScheme;

        const surveySchemeCopy = await SurveyScheme.create({
          name,
          type,
          version,
          visibility,
          prompts,
          meals,
          dataExport,
          ownerId: userId,
        });

        return { status: 200, body: surveySchemeResponse(surveySchemeCopy) };
      },
    },
    templates: {
      middleware: [permission('survey-schemes')],
      handler: async ({ params: { surveySchemeId }, query, req }) => {
        await req.scope.cradle.aclService.findAndCheckRecordAccess(SurveyScheme, 'prompts', {
          attributes: ['id'],
          where: { id: surveySchemeId },
        });

        const surveySchemePrompts = await SurveySchemePrompt.paginate({
          query,
          columns: ['name', 'promptId'],
          order: [['promptId', 'ASC']],
          transform: ({ prompt }) => prompt,
        });

        return { status: 200, body: surveySchemePrompts };
      },
    },
    dataExportRefs: {
      middleware: [permission('survey-schemes')],
      handler: async ({ params: { surveySchemeId }, req }) => {
        const { aclService, dataExportFields } = req.scope.cradle;

        const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'data-export', {
          attributes: ['id', 'prompts'],
          where: { id: surveySchemeId },
        });

        const fieldMapper = ({ id, label }: ExportField) => ({ id, label });

        const fields: SurveySchemeExportRefs = {};
        for (const [section, callback] of Object.entries(dataExportFields)) {
          const sectionFields = await callback(surveyScheme);
          fields[section as ExportSectionId] = sectionFields.map(fieldMapper);
        }

        return { status: 200, body: fields };
      },
    },
  });
}
