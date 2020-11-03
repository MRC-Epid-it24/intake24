import passport from 'passport';
import { AppLoader } from '@/loaders/loader';
import jwtStrategies from '@/services/auth/strategies';

export default ({ app }: AppLoader): void => {
  app.use(passport.initialize());
  jwtStrategies(passport);
};
