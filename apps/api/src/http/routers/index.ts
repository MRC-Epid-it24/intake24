import type { Router } from 'express';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import passport from 'passport';

import { contract } from '@intake24/common/contracts';
import { FeedbackScheme, Language, Survey, SurveyScheme, SystemLocale } from '@intake24/db';

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
import { health } from './health.router';
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
      health: health(),
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
      // @ts-expect-error fix types (caused by 204/undefined)
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
    feedbackScheme: contract.admin.feedbackScheme,
    feedbackSchemeSecurable: contract.admin.feedbackSchemeSecurable,
    foodDb: contract.admin.foodDb,
    foodGroup: contract.admin.foodGroup,
    job: contract.admin.job,
    language: contract.admin.language,
    languageSecurable: contract.admin.languageSecurable,
    languageTranslation: contract.admin.languageTranslation,
    locale: contract.admin.locale.locale,
    localeRecipeFood: contract.admin.locale.recipeFood,
    localeSplitList: contract.admin.locale.splitList,
    localeSplitWord: contract.admin.locale.splitWord,
    localeSynonymSet: contract.admin.locale.synonymSet,
    localeSecurable: contract.admin.localeSecurable,
    nutrientTable: contract.admin.nutrientTable,
    nutrientType: contract.admin.nutrientType,
    nutrientUnit: contract.admin.nutrientUnit,
    reference: contract.admin.reference,
    signInLog: contract.admin.signInLog,
    standardUnit: contract.admin.standardUnit,
    surveyScheme: contract.admin.surveyScheme,
    surveySchemePrompt: contract.admin.surveySchemePrompt,
    surveySchemeSecurable: contract.admin.surveySchemeSecurable,
    survey: contract.admin.survey.survey,
    surveyRespondent: contract.admin.survey.respondent,
    surveyRespondentCustomField: contract.admin.survey.respondentCustomField,
    surveySecurable: contract.admin.surveySecurable,
    surveySession: contract.admin.survey.session,
    surveySubmission: contract.admin.survey.submission,
    task: contract.admin.task,
    personalAccessToken: contract.admin.user.personalAccessToken,
    device: contract.admin.user.mfa.device,
    duo: contract.admin.user.mfa.duo,
    fido: contract.admin.user.mfa.fido,
    otp: contract.admin.user.mfa.otp,
    permission: contract.admin.acl.permission,
    role: contract.admin.acl.role,
    user: contract.admin.acl.user,
  };

  createExpressEndpoints(
    adminAuthVerifiedContract,
    server.router(adminAuthVerifiedContract, {
      feedbackScheme: admin.feedbackScheme(),
      feedbackSchemeSecurable: admin.securable(FeedbackScheme)(),
      foodDb: admin.foodDb(),
      foodGroup: admin.foodGroup(),
      job: admin.job(),
      language: admin.language(),
      languageTranslation: admin.languageTranslation(),
      languageSecurable: admin.securable(Language)(),
      locale: admin.locale.locale(),
      localeRecipeFood: admin.locale.recipeFood(),
      localeSplitList: admin.locale.splitList(),
      localeSplitWord: admin.locale.splitWord(),
      localeSynonymSet: admin.locale.synonymSet(),
      localeSecurable: admin.securable(SystemLocale)(),
      nutrientTable: admin.nutrientTable(),
      nutrientType: admin.nutrientType(),
      nutrientUnit: admin.nutrientUnit(),
      reference: admin.reference(),
      signInLog: admin.signInLog(),
      standardUnit: admin.standardUnit(),
      survey: admin.survey.survey(),
      surveyRespondent: admin.survey.respondent(),
      surveyRespondentCustomField: admin.survey.respondentCustomField(),
      surveySecurable: admin.securable(Survey)(),
      surveySession: admin.survey.session(),
      surveySubmission: admin.survey.submission(),
      surveyScheme: admin.surveyScheme(),
      surveySchemePrompt: admin.surveySchemePrompt(),
      surveySchemeSecurable: admin.securable(SurveyScheme)(),
      task: admin.task(),
      personalAccessToken: admin.user.personalAccessToken(),
      device: admin.user.mfa.device(),
      duo: admin.user.mfa.duo(),
      fido: admin.user.mfa.fido(),
      otp: admin.user.mfa.otp(),
      permission: admin.acl.permission(),
      role: admin.acl.role(),
      user: admin.acl.user(),
    }),
    express,
    {
      responseValidation,
      // @ts-expect-error fix types (caused by 204/undefined)
      requestValidationErrorHandler,
      globalMiddleware: [
        passport.authenticate('admin', { session: false }),
        registerACLScope,
        isAccountVerified,
      ],
    },
  );
}
