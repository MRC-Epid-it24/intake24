import { FormData } from 'formdata-node';

import type { LocaleTranslation } from '@intake24/common/types';
import type {
  DrinkScaleEntry,
  DrinkScaleV2Entry,
  DrinkwareSetEntry,
} from '@intake24/common/types/http/admin';
import type { Pagination } from '@intake24/db';
import { AsServedSetEntry } from '@intake24/common/types/http/admin';

import type { BaseClientV4 } from './base-client-v4';
import type { CreateResult } from './create-response';
import { parseCreateResponse } from './create-response';
import { fileFromPathWithType } from './form-data-helpers';

export class DrinkwareApiV4 {
  private static readonly apiPath = '/api/admin/images/drinkware-sets';

  private readonly baseClient: BaseClientV4;
  constructor(baseClient: BaseClientV4) {
    this.baseClient = baseClient;
  }

  public async create(set: DrinkwareSetEntry): Promise<DrinkwareSetEntry> {
    return this.baseClient.post<DrinkwareSetEntry>(DrinkwareApiV4.apiPath, set);
  }

  public async createScale(
    drinkwareSetId: string,
    choiceId: string,
    baseImagePath: string,
    label: LocaleTranslation,
    outlineCoordinates: number[],
    volumeSamples: number[],
    update: boolean = false
  ): Promise<CreateResult<DrinkScaleV2Entry>> {
    const formData = new FormData();

    const file = await fileFromPathWithType(baseImagePath);

    formData.set('label', JSON.stringify(label));
    formData.set('outlineCoordinates', JSON.stringify(outlineCoordinates));
    formData.set('volumeSamples', JSON.stringify(volumeSamples));
    formData.set('image', file);

    const response = await this.baseClient.postResponse<DrinkScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales/${choiceId}?update=${update}`,
      formData
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async getScales(
    drinkwareSetId: string
  ): Promise<DrinkScaleEntry | DrinkScaleV2Entry | null> {
    return this.baseClient.getOptional<DrinkScaleEntry | DrinkScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales`
    );
  }

  public async getScale(
    drinkwareSetId: string,
    choiceId: string
  ): Promise<DrinkScaleEntry | DrinkScaleV2Entry | null> {
    return this.baseClient.getOptional<DrinkScaleEntry | DrinkScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales/${choiceId}`
    );
  }
}
