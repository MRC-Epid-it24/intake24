import type { Pagination, SignInLogAttributes } from '@intake24/db';

export type SignInLogsResponse = Pagination<SignInLogAttributes>;

export type SignInLogEntry = SignInLogAttributes;
