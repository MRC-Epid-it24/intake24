import job from './job.controller';
import mfa from './mfa';
import personalAccessToken from './personal-access-tokens.controller';
import profile from './profile.controller';

export * from './job.controller';
export * from './mfa';
export * from './personal-access-tokens.controller';
export * from './profile.controller';

export default {
  job,
  mfa,
  profile,
  personalAccessToken,
};
