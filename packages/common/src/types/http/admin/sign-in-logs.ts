import { Pagination, SignInLogAttributes } from '../../models';

export type SignInLogsResponse = Pagination<SignInLogAttributes>;

export type SignInLogEntry = SignInLogAttributes;
