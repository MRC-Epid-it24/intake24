/* eslint-disable @typescript-eslint/no-shadow */
import { Request, Response, NextFunction } from 'express';
import config from '@/config/acl';
import { User } from '@/db/models/system';
import { ForbiddenError } from '@/http/errors';
import { foodDatabaseMaintainer, surveyRespondent, surveyStaff } from '@/services/acl.service';

export const permission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void =>
    (req.user as User).hasPermissionByName(permission) ? next() : next(new ForbiddenError());
};

export const role = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void =>
    (req.user as User).hasRoleByName(role) ? next() : next(new ForbiddenError());
};

// TODO: augment Express request user property with our model - must match with passport-jwt

export const canManageFoodDatabase = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { fdbId } = req.params;

    return (req.user as User).hasAnyPermission([
      config.permissions.foodsadmin,
      foodDatabaseMaintainer(fdbId),
    ])
      ? next()
      : next(new ForbiddenError());
  };
};

export const canManageSurvey = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;

    return (req.user as User).hasAnyPermission([
      config.permissions.surveyadmin,
      surveyStaff(surveyId),
    ])
      ? next()
      : next(new ForbiddenError());
  };
};

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    return (req.user as User).hasPermissionByName(surveyRespondent(surveyId))
      ? next()
      : next(new ForbiddenError());
  };
};

// TODO: temp - to remove
export const isSuperUser = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRoleByName(config.roles.superuser)
      ? next()
      : next(new ForbiddenError());
  };
};
