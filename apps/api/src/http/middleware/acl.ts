/* eslint-disable @typescript-eslint/no-shadow */
import type { NextFunction, Request, Response, Router } from 'express';
import { asValue } from 'awilix';
import passport from 'passport';

import type { FrontEnd } from '@intake24/common/types';
import type { User } from '@intake24/db';
import { ForbiddenError } from '@intake24/api/http/errors';
import { foodDatabaseMaintainer, foodsAdmin, surveyRespondent } from '@intake24/common/security';

/**
 * Check if account is disabled
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const isAccountDisabled = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as User;

  user.isDisabled() ? next(new ForbiddenError('Account is disabled')) : next();
};

/**
 * Verify authenticated user has verified the email address
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const isAccountVerified = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as User;

  user.isVerified() ? next() : next(new ForbiddenError('Email not verified'));
};

/*
 * This middleware should be placed after authentication
 * It assumes successfully authenticated user on request scope hence the assertion to User
 */
export const registerACLScope = (req: Request, res: Response, next: NextFunction): void => {
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
export const authenticate = (app: Router, type: FrontEnd): void => {
  app.use(passport.authenticate(type, { session: false }));
  app.use(isAccountDisabled);

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

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { slug } = req.params;

    req.scope.cradle.aclService
      .hasPermission(surveyRespondent(slug))
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};
