import type { Router } from 'express';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import passport from 'passport';

import { contract } from '@intake24/common/contracts';

import { isSurveyRespondent, registerACLScope, requestValidationErrorHandler } from '../middleware';
import { authentication } from './authentication.router';
import { category } from './category.router';
import { feedback } from './feedback.router';
import { food } from './food.router';
import { i18n } from './i18n.router';
import { password } from './password.router';
import { portionSize } from './portion-size.router';
import { subscription } from './subscription.router';
import { survey } from './survey.router';
import { surveyRespondent } from './survey-respondent.router';
import user from './user';

const server = initServer();

export const registerRouters = (express: Router) => {
  const responseValidation = false;
  // Public endpoints
  createExpressEndpoints(
    contract.public,
    server.router(contract.public, {
      authentication: authentication(),
      i18n: i18n(),
      password: password(),
      survey: survey(),
    }),
    express,
    {
      responseValidation,
      requestValidationErrorHandler,
    }
  );
  // Authenticated endpoints
  const authContract = {
    category: contract.category,
    feedback: contract.feedback,
    food: contract.food,
    portionSize: contract.portionSize,
    subscription: contract.subscription,
    user: contract.user,
  };
  createExpressEndpoints(
    authContract,
    server.router(authContract, {
      category: category(),
      feedback: feedback(),
      food: food(),
      portionSize: portionSize(),
      subscription: subscription(),
      user: {
        profile: user.profile(),
        feedback: user.feedback(),
      },
    }),
    express,
    {
      responseValidation,
      requestValidationErrorHandler,
      globalMiddleware: [passport.authenticate('survey', { session: false }), registerACLScope],
    }
  );
  // Survey respondent endpoints
  createExpressEndpoints(
    contract.surveyRespondent,
    server.router(contract.surveyRespondent, surveyRespondent()),
    express,
    {
      responseValidation,
      requestValidationErrorHandler,
      globalMiddleware: [
        passport.authenticate('survey', { session: false }),
        registerACLScope,
        isSurveyRespondent(),
      ],
    }
  );
};
