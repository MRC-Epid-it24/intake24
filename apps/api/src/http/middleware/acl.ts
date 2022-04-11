/* eslint-disable @typescript-eslint/no-shadow */
import { asValue } from 'awilix';
import type { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '@intake24/db';
import { ForbiddenError } from '@intake24/api/http/errors';
import ioc, { IoC } from '@intake24/api/ioc';
import {
  foodDatabaseMaintainer,
  surveyRespondent,
  surveyStaff,
  surveyAdmin,
  foodsAdmin,
} from '@intake24/common/security';

/*
 * This middleware should be placed after authentication
 * It assumes successfully authenticated user on request scope hence the assertion to User
 */
export const registerACLScope = (req: Request, res: Response, next: NextFunction): void => {
  req.scope = ioc.createScope<IoC>();

  const user = req.user as User;

  req.scope.register({
    currentUser: asValue(user),
    userId: asValue(user.id),
  });

  next();
};

/**
 * Helper to register authentication and ACL scope middleware in routers
 */
export const authenticate = (app: Router, type: string): void => {
  app.use(passport.authenticate(type, { session: false }));
  app.use(registerACLScope);
};

export const permission = (permission: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.scope.cradle.aclService
      .hasPermission(permission)
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const anyPermission = (permission: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.scope.cradle.aclService
      .hasAnyPermission(permission)
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const role = (role: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.scope.cradle.aclService
      .hasRole(role)
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const canManageFoodDatabase = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { localeId } = req.params;

    req.scope.cradle.aclService
      .hasAnyPermission([foodsAdmin, foodDatabaseMaintainer(localeId)])
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const canManageSurvey = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;

    req.scope.cradle.aclService
      .hasAnyPermission([surveyAdmin, surveyStaff(surveyId)])
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;

    req.scope.cradle.aclService
      .hasPermission(surveyRespondent(surveyId))
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};
