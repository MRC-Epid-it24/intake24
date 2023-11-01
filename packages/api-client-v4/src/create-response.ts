import type { AxiosResponse } from 'axios';
import type winston from 'winston';
import { HttpStatusCode } from 'axios';

export interface CreateSuccess<T> {
  type: 'success';
  data: T;
}

export interface CreateConflict {
  type: 'conflict';
  details: any;
}

export type CreateResult<T> = CreateSuccess<T> | CreateConflict;

export function parseCreateResponse<T>(
  response: AxiosResponse<T>,
  logger: winston.Logger
): CreateResult<T> {
  if (response.status === HttpStatusCode.Ok || response.status === HttpStatusCode.Created) {
    return {
      type: 'success',
      data: response.data,
    };
  } else if (response.status === HttpStatusCode.Conflict) {
    return {
      type: 'conflict',
      details: response.data,
    };
  } else {
    {
      const message = `Unexpected HTTP status: ${response.status} for ${response.request.method} ${response.request.path}`;

      logger.error(message);
      logger.error(JSON.stringify(response.data, null, 2));

      throw new Error(message);
    }
  }
}
