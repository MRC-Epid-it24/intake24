import type { Router } from 'express';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import passport from 'passport';

import { contract } from '@intake24/common/contracts';

import {
  isAccountVerified,
  isSurveyRespondent,
  registerACLScope,
  requestValidationErrorHandler,
} from '../middleware';
import admin from './admin';
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

export function registerRouters(express: Router) {
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
    { responseValidation, requestValidationErrorHandler },
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
    },
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
    },
  );

  // Admin endpoints - public
  const adminPublicContract = {
    authentication: contract.admin.authentication,
    signUp: contract.admin.signUp,
  };

  createExpressEndpoints(
    adminPublicContract,
    server.router(adminPublicContract, {
      authentication: admin.authentication(),
      signUp: admin.signUp(),
    }),
    express,
    { responseValidation, requestValidationErrorHandler },
  );

  // Admin endpoints - authenticated
  const adminAuthContract = {
    job: contract.admin.user.job,
    profile: contract.admin.user.profile,
  };

  createExpressEndpoints(
    adminAuthContract,
    server.router(adminAuthContract, {
      job: admin.user.job(),
      profile: admin.user.profile(),
    }),
    express,
    {
      responseValidation,
      requestValidationErrorHandler,
      globalMiddleware: [passport.authenticate('admin', { session: false }), registerACLScope],
    },
  );

  // Admin endpoints - authenticated & verified
  const adminAuthVerifiedContract = {
    job: contract.admin.job,
    signInLog: contract.admin.signInLog,
    nutrientTable: contract.admin.nutrientTable,
    nutrientType: contract.admin.nutrientType,
    nutrientUnit: contract.admin.nutrientUnit,
    standardUnit: contract.admin.standardUnit,
    surveySession: contract.admin.survey.session,
    task: contract.admin.task,
    personalAccessToken: contract.admin.user.personalAccessToken,
    device: contract.admin.user.mfa.device,
    duo: contract.admin.user.mfa.duo,
    fido: contract.admin.user.mfa.fido,
    otp: contract.admin.user.mfa.otp,
  };

  createExpressEndpoints(
    adminAuthVerifiedContract,
    server.router(adminAuthVerifiedContract, {
      job: admin.job(),
      signInLog: admin.signInLog(),
      nutrientTable: admin.nutrientTable(),
      nutrientType: admin.nutrientType(),
      nutrientUnit: admin.nutrientUnit(),
      standardUnit: admin.standardUnit(),
      surveySession: admin.survey.session(),
      task: admin.task(),
      personalAccessToken: admin.user.personalAccessToken(),
      device: admin.user.mfa.device(),
      duo: admin.user.mfa.duo(),
      fido: admin.user.mfa.fido(),
      otp: admin.user.mfa.otp(),
    }),
    express,
    {
      responseValidation,
      // @ts-expect-error fix types
      requestValidationErrorHandler,
      globalMiddleware: [
        passport.authenticate('admin', { session: false }),
        registerACLScope,
        isAccountVerified,
      ],
    },
  );
}
