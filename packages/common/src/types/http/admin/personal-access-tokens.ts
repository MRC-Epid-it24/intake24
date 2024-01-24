import type { Pagination, PersonalAccessTokenAttributes } from '@intake24/db';

export type PersonalAccessTokensResponse = Pagination<Omit<PersonalAccessTokenAttributes, 'token'>>;

export type PersonalAccessTokenEntry = {
  jwt: string;
  token: Omit<PersonalAccessTokenAttributes, 'token'>;
};
