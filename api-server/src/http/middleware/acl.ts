import { Request, Response, NextFunction } from 'express';
import User from '@/db/models/system/user';
import ForbiddenError from '@/http/errors/forbidden.error';
import {
  foodDatabaseMaintainer,
  foodDatabaseMaintainerPrefix,
  Roles,
  staffSuffix,
  surveyRespondent,
  surveyStaff,
} from '@/services/acl.service';

// TODO: augment Express request user property with our model - must match with passport-jwt

export const canManageFoodDatabase = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { fdbId } = req.params;
    const user = req.user as User;

    const check =
      user.hasAnyRole([Roles.SUPERUSER, Roles.FOODSADMIN, foodDatabaseMaintainer(fdbId)]) ||
      (!fdbId && user.roles?.some((role) => role.role.startsWith(foodDatabaseMaintainerPrefix)));

    return check ? next() : next(new ForbiddenError());
  };
};

export const canCreateSurvey = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as User;

    return user.hasAnyRole([Roles.SUPERUSER, Roles.SURVEYADMIN])
      ? next()
      : next(new ForbiddenError());
  };
};

export const canManageSurvey = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    const user = req.user as User;

    const check =
      user.hasAnyRole([Roles.SUPERUSER, Roles.SURVEYADMIN, surveyStaff(surveyId)]) ||
      (!surveyId && user.roles?.some((role) => role.role.endsWith(staffSuffix)));

    return check ? next() : next(new ForbiddenError());
  };
};

export const canManageUsers = () => {
  return (req: Request, res: Response, next: NextFunction): void =>
    (req.user as User).hasRole(Roles.SUPERUSER) ? next() : next(new ForbiddenError());
};

export const hasRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void =>
    (req.user as User).hasRole(role) ? next() : next(new ForbiddenError());
};

export const isFoodsAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRole(Roles.FOODSADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isImagesAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRole(Roles.IMAGESADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isGlobalSupportAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRole(Roles.GLOBALSUPPORT) ? next() : next(new ForbiddenError());
  };
};

export const isSurveyAdmin = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRole(Roles.SURVEYADMIN) ? next() : next(new ForbiddenError());
  };
};

export const isSurveyRespondent = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    return (req.user as User).hasRole(surveyRespondent(surveyId))
      ? next()
      : next(new ForbiddenError());
  };
};

export const isSurveyStaff = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { surveyId } = req.params;
    return (req.user as User).hasRole(surveyStaff(surveyId)) ? next() : next(new ForbiddenError());
  };
};

export const isSuperUser = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    return (req.user as User).hasRole(Roles.SUPERUSER) ? next() : next(new ForbiddenError());
  };
};
