import type { RawAxiosRequestHeaders } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type { JobType } from '@intake24/common/types';

import BaseJob from './job';

export default abstract class Notification<T extends JobType> extends BaseJob<T> {
  private appConfig;

  private jwtService;

  constructor({ appConfig, jwtService, logger }: Pick<IoC, 'appConfig' | 'jwtService' | 'logger'>) {
    super({ logger });

    this.appConfig = appConfig;
    this.jwtService = jwtService;
  }

  protected async getSignatureHeaders(
    url: string,
    signOptions?: { payload: object; secret: string },
  ) {
    const headers: RawAxiosRequestHeaders = {
      'content-type': 'application/json',
      'intake24-version': this.appConfig.version,
      'user-agent': this.appConfig.name,
    };

    if (signOptions) {
      const token = await this.jwtService.sign(signOptions.payload, signOptions.secret, {
        audience: url,
        expiresIn: '1m',
      });
      headers.authorization = `Bearer ${token}`;
    }

    return headers;
  }
}
