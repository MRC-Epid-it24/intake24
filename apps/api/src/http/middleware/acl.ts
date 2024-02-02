/* eslint-disable @typescript-eslint/no-shadow */
import type { NextFunction, Request, Response, Router } from 'express';
import { asValue } from 'awilix';
import passport from 'passport';

import type { TokenPayload } from '@intake24/common/security';
import type { FrontEnd } from '@intake24/common/types';
import { ForbiddenError } from '@intake24/api/http/errors';
import { surveyRespondent } from '@intake24/common/security';

/**
 * Verify authenticated user has verified the email address
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const isAccountVerified = (req: Request, res: Response, next: NextFunction): void => {
  (req.user as TokenPayload).verified ? next() : next(new ForbiddenError('Account not verified'));
};

/*
 * This middleware should be placed after authentication
 * It assumes successfully authenticated user on request scope hence the assertion to User
 */
export const registerACLScope = (req: Request, res: Response, next: NextFunction): void => {
  req.scope.register({ user: asValue(req.user as TokenPayload) });

  next();
};

/**
 * Helper to register authentication and ACL scope middleware in routers
 */
export const authenticate = (app: Router, type: FrontEnd): void => {
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

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { slug } = req.params;

    req.scope.cradle.aclService
      .hasPermission(surveyRespondent(slug))
      .then((result) => (result ? next() : next(new ForbiddenError())))
      .catch((err) => next(err));
  };
};
