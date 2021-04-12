/* eslint-disable @typescript-eslint/no-shadow */
import { asValue } from 'awilix';
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '@/db/models/system';
import { ForbiddenError } from '@/http/errors';
import ioc, { IoC } from '@/ioc';
import { foodDatabaseMaintainer, surveyRespondent, surveyStaff } from '@/services/auth';

const { acl: AclConfig } = ioc.cradle.config;

/*
 * This middleware should be placed after authentication
 * It assumes successfully authenticated user on request scope hence the assertion to User
 */
export const registerACLScope = (req: Request, res: Response, next: NextFunction): void => {
  req.scope = ioc.createScope<IoC>();

  req.scope.register({
    currentUser: asValue(req.user as User),
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

export const permission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.scope.cradle.aclService
      .hasPermission(permission)
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const role = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.scope.cradle.aclService
      .hasRole(role)
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const canManageFoodDatabase = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { fdbId } = req.params;

    req.scope.cradle.aclService
      .hasAnyPermission([AclConfig.permissions.foodsadmin, foodDatabaseMaintainer(fdbId)])
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};

export const canManageSurvey = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;

    req.scope.cradle.aclService
      .hasAnyPermission([AclConfig.permissions.surveyadmin, surveyStaff(surveyId)])
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
