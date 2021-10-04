import type { Express } from 'express';
import passport from 'passport';
import jwtStrategies from '@api/services/auth/strategies';

export default (app: Express): void => {
  app.use(passport.initialize());
  jwtStrategies(passport);
};
