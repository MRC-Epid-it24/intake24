import { Request, Response, NextFunction } from 'express';
import ForbiddenError from '@/http/errors/forbidden.error';
import User from '@/db/models/system/user';

// TODO: augment Express request user property with our model - must match with passport-jwt

enum Roles {
  FOODSADMIN = 'foodsadmin',
  IMAGESADMIN = 'imagesadmin',
  GLOBALSUPPORT = 'globalsupport',
  SURVEYADMIN = 'surveyadmin',
  SUPERUSER = 'superuser',
}

export const hasRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void =>
    (req.user as User)?.hasRole(role) ? next() : next(new ForbiddenError());
};

export const isFoodsAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User)?.hasRole(Roles.FOODSADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isImagesAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User)?.hasRole(Roles.IMAGESADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isGlobalSupportAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User)?.hasRole(Roles.GLOBALSUPPORT) ? next() : next(new ForbiddenError());
  };
};

export const isSurveyAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User)?.hasRole(Roles.SURVEYADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    return (req.user as User)?.hasRole(`${surveyId}/respondent`)
      ? next()
      : next(new ForbiddenError());
  };
};

export const isSurveyStaff = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    return (req.user as User)?.hasRole(`${surveyId}/staff`) ? next() : next(new ForbiddenError());
  };
};

export const isSuperUser = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User)?.hasRole(Roles.SUPERUSER) ? next() : next(new ForbiddenError());
  };
};
