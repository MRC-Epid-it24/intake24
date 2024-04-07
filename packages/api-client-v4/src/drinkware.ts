import { FormData } from 'formdata-node';

import type { LocaleTranslation } from '@intake24/common/types';
import type {
  CreateDrinkwareSetInput,
  DrinkwareScaleEntry,
  DrinkwareScaleV2Entry,
  DrinkwareSetEntry,
  UpdateDrinkwareSetInput,
} from '@intake24/common/types/http/admin';

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

  public async create(set: CreateDrinkwareSetInput): Promise<CreateResult<DrinkwareSetEntry>> {
    const response = await this.baseClient.postResponse<DrinkwareSetEntry>(
      DrinkwareApiV4.apiPath,
      set,
    );
    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async update(setId: string, update: UpdateDrinkwareSetInput): Promise<DrinkwareSetEntry> {
    return await this.baseClient.put<DrinkwareSetEntry>(
      `${DrinkwareApiV4.apiPath}/${setId}`,
      update,
    );
  }

  public async get(setId: string): Promise<DrinkwareSetEntry | null> {
    return this.baseClient.getOptional<DrinkwareSetEntry>(`${DrinkwareApiV4.apiPath}/${setId}`);
  }

  public async deleteAllScales(setId: string): Promise<void> {
    return await this.baseClient.delete(`${DrinkwareApiV4.apiPath}/${setId}/scales`);
  }

  public async createScaleV1(
    drinkwareSetId: string,
    choiceId: string,
    width: number,
    height: number,
    emptyLevel: number,
    fullLevel: number,
    baseImagePath: string,
    overlayImagePath: string,
    label: string,
    volumeSamples: number[],
    returning: boolean = false,
    updateOnConflict: boolean = false,
  ): Promise<CreateResult<DrinkwareScaleEntry | undefined>> {
    const formData = new FormData();

    const baseImageFile = await fileFromPathWithType(baseImagePath);
    const overlayImageFile = await fileFromPathWithType(overlayImagePath);

    formData.set('label', label);
    formData.set('width', width);
    formData.set('height', height);
    formData.set('emptyLevel', emptyLevel);
    formData.set('fullLevel', fullLevel);
    formData.set('volumeSamples', JSON.stringify(volumeSamples));
    formData.set('baseImage', baseImageFile);
    formData.set('overlayImage', overlayImageFile);

    const response = await this.baseClient.postResponse<DrinkwareScaleEntry | undefined>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales/${choiceId}/v1?version=1&updateOnConflict=${updateOnConflict}&return=${returning}`,
      formData,
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async createScaleV2(
    drinkwareSetId: string,
    choiceId: string,
    baseImagePath: string,
    label: LocaleTranslation,
    outlineCoordinates: number[],
    volumeSamples: number[],
    returning: boolean = false,
    updateOnConflict: boolean = false,
  ): Promise<CreateResult<DrinkwareScaleV2Entry>> {
    const formData = new FormData();

    const file = await fileFromPathWithType(baseImagePath);

    formData.set('version', 2);
    formData.set('label', JSON.stringify(label));
    formData.set('outlineCoordinates', JSON.stringify(outlineCoordinates));
    formData.set('volumeSamples', JSON.stringify(volumeSamples));
    formData.set('image', file);

    const response = await this.baseClient.postResponse<DrinkwareScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales/${choiceId}/v2?updateOnConflict=${updateOnConflict}&return=${returning}`,
      formData,
    );

    return parseCreateResponse(response, this.baseClient.logger);
  }

  public async getScales(
    drinkwareSetId: string,
  ): Promise<DrinkwareScaleEntry | DrinkwareScaleV2Entry | null> {
    return this.baseClient.getOptional<DrinkwareScaleEntry | DrinkwareScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales`,
    );
  }

  public async getScale(
    drinkwareSetId: string,
    choiceId: string,
  ): Promise<DrinkwareScaleEntry | DrinkwareScaleV2Entry | null> {
    return this.baseClient.getOptional<DrinkwareScaleEntry | DrinkwareScaleV2Entry>(
      `${DrinkwareApiV4.apiPath}/${drinkwareSetId}/scales/${choiceId}`,
    );
  }
}
