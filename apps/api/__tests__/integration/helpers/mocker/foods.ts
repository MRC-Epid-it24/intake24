import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import slugify from 'slugify';

import type {
  CreateAsServedSetInput,
  // CreateLocaleRequest,
  NutrientTableInput,
  NutrientTypeRequest,
  NutrientUnitRequest,
} from '@intake24/common/types/http/admin';
import type { StandardUnitCreationAttributes } from '@intake24/common/types/models';
import { toStandardUnitId } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';

import { downloadImage } from '../util';

const food = (foodGroupId: string) => ({
  code: randomString(8),
  foodGroupId,
  name: faker.random.words(5),
  version: randomUUID(),
});

const foodGroup = () => ({
  name: faker.random.words(10),
});

const asServedSet = async (asServedSetId?: string): Promise<CreateAsServedSetInput> => {
  const id = asServedSetId ?? randomString(32);
  const originalname = `${id}.jpg`;

  const filePath = await downloadImage('https://picsum.photos/1200/800.jpg', originalname);

  return {
    id,
    description: `${id}_description`,
    file: { originalname: `${id}.jpg`, path: filePath },
    uploader: 'admin',
  };
};

/* const locale = (
  respLangId: string | undefined,
  adminLangId: string | undefined
): CreateLocaleRequest => {
  const id = faker.address.countryCode();
  const englishName = faker.address.country();
  const localName = faker.address.country();
  const respondentLanguageId = respLangId ?? faker.address.countryCode();
  const adminLanguageId = adminLangId ?? faker.address.countryCode();
  const countryFlagCode = faker.address.countryCode();
  const prototypeLocaleId = null;
  const textDirection = 'ltr';
  const foodIndexLanguageBackendId = 'en';

  return {
    id,
    englishName,
    localName,
    respondentLanguageId,
    adminLanguageId,
    countryFlagCode,
    prototypeLocaleId,
    textDirection,
    foodIndexLanguageBackendId,
  };
}; */

const nutrientTable = (): NutrientTableInput => {
  return {
    id: slugify(randomString(16), { strict: true }),
    description: faker.random.words(5),
    csvMapping: {
      idColumnOffset: faker.datatype.number(100),
      descriptionColumnOffset: faker.datatype.number(100),
      localDescriptionColumnOffset: faker.datatype.number(100),
      rowOffset: faker.datatype.number(100),
    },
    csvMappingFields: [
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.datatype.number(200),
      },
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.datatype.number(200),
      },
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.datatype.number(200),
      },
    ],
    csvMappingNutrients: [
      { nutrientTypeId: '1', columnOffset: faker.datatype.number(200) },
      { nutrientTypeId: '2', columnOffset: faker.datatype.number(200) },
      { nutrientTypeId: '3', columnOffset: faker.datatype.number(200) },
    ],
  };
};

const nutrientType = (unitId: string, kcalPerUnit?: number | null): NutrientTypeRequest => ({
  id: faker.datatype.number({ min: 1000, max: 1000000 }).toString(),
  unitId,
  description: faker.random.words(5),
  kcalPerUnit,
});

const nutrientUnit = (): NutrientUnitRequest => ({
  id: faker.datatype.number({ min: 1000, max: 1000000 }).toString(),
  description: faker.random.words(5),
  symbol: faker.random.word(),
});

const standardUnit = (): StandardUnitCreationAttributes => ({
  id: toStandardUnitId(faker.random.words(3)),
  estimateIn: { en: faker.random.words(5), es: faker.random.words(5) },
  howMany: { en: faker.random.words(5), es: faker.random.words(5) },
});

export default {
  food,
  foodGroup,
  asServedSet,
  // locale,
  nutrientTable,
  nutrientType,
  nutrientUnit,
  standardUnit,
};
