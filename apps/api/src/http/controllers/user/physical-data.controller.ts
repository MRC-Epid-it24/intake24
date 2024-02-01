import type { Request, Response } from 'express';
import type { FieldValidationError } from 'express-validator';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { UserPhysicalDataResponse } from '@intake24/common/types/http';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { Survey } from '@intake24/db';

const userPhysicalDataController = ({ userService }: Pick<IoC, 'userService'>) => {
  const getPhysicalData = async (
    req: Request<any, any, any, { survey?: string }>,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { survey: slug } = req.query;
    const { userId } = req.scope.cradle.user;

    if (slug) {
      const survey = await Survey.findBySlug(slug, {
        attributes: ['id'],
        include: [{ association: 'feedbackScheme', attributes: ['id'] }],
      });
      if (!survey) throw new NotFoundError();

      if (!survey.feedbackScheme) throw new ForbiddenError();
    }

    const data = await userService.getPhysicalData(userId);

    res.json(data);
  };

  const setPhysicalData = async (
    req: Request<any, any, any, { survey?: string }>,
    res: Response<UserPhysicalDataResponse>
  ): Promise<void> => {
    const { survey: slug } = req.query;
    const { userId } = req.scope.cradle.user;

    if (slug) {
      const survey = await Survey.findBySlug(slug, {
        attributes: ['id'],
        include: [{ association: 'feedbackScheme', attributes: ['id', 'physicalDataFields'] }],
      });
      if (!survey) throw new NotFoundError();

      if (!survey.feedbackScheme) throw new ForbiddenError();

      const errors = survey.feedbackScheme.physicalDataFields.reduce<
        Partial<FieldValidationError>[]
      >((acc, item) => {
        if (req.body[item] === undefined || req.body[item] === null)
          acc.push({
            path: item,
            msg: 'Physical parameter is required for feedback calculation',
          });

        return acc;
      }, []);

      if (errors.length) throw new ValidationError('Missing physical data fields', errors);
    }

    const data = await userService.setPhysicalData(
      userId,
      pick(req.body, [
        'sex',
        'birthdate',
        'weightKg',
        'heightCm',
        'physicalActivityLevelId',
        'weightTarget',
      ])
    );

    res.json(data);
  };

  return {
    getPhysicalData,
    setPhysicalData,
  };
};

export default userPhysicalDataController;

export type UserPhysicalDataController = ReturnType<typeof userPhysicalDataController>;
