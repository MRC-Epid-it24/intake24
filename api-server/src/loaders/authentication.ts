import passport from 'passport';
import { AppLoader } from '@/loaders/loader';
import { jwtStrategy } from '@/services/jwt.service';

export default ({ app }: AppLoader): void => {
  app.use(passport.initialize());
  jwtStrategy(passport);
};
