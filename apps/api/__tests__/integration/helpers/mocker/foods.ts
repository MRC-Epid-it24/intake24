import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import slugify from 'slugify';

import type {
  CreateAsServedSetInput,
  // CreateLocaleRequest,
  NutrientTableRequest,
  NutrientTypeRequest,
  NutrientUnitRequest,
} from '@intake24/common/types/http/admin';
import type { StandardUnitCreationAttributes } from '@intake24/db';
import { randomString, toStandardUnitId } from '@intake24/common/util';

import { downloadImage } from '../util';

const category = () => ({
  code: randomString(8),
  name: faker.word.words(5),
  isHidden: faker.datatype.boolean(),
  version: randomUUID(),
});

const food = (foodGroupId: string) => ({
  code: randomString(8),
  foodGroupId,
  name: faker.word.words(5),
  version: randomUUID(),
});

const foodGroup = () => ({
  name: faker.word.words(10),
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
  const id = faker.location.countryCode();
  const englishName = faker.location.country();
  const localName = faker.location.country();
  const respondentLanguageId = respLangId ?? faker.location.countryCode();
  const adminLanguageId = adminLangId ?? faker.location.countryCode();
  const countryFlagCode = faker.location.countryCode();
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

const nutrientTable = (): NutrientTableRequest => {
  return {
    id: slugify(randomString(16), { strict: true }),
    description: faker.word.words(5),
    csvMapping: {
      idColumnOffset: faker.number.int(100),
      descriptionColumnOffset: faker.number.int(100),
      localDescriptionColumnOffset: faker.number.int(100),
      rowOffset: faker.number.int(100),
    },
    csvMappingFields: [
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.number.int(200),
      },
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.number.int(200),
      },
      {
        fieldName: slugify(randomString(16), { strict: true }),
        columnOffset: faker.number.int(200),
      },
    ],
    csvMappingNutrients: [
      { nutrientTypeId: '1', columnOffset: faker.number.int(200) },
      { nutrientTypeId: '2', columnOffset: faker.number.int(200) },
      { nutrientTypeId: '3', columnOffset: faker.number.int(200) },
    ],
  };
};

const nutrientType = (unitId: string, kcalPerUnit?: number | null): NutrientTypeRequest => ({
  id: faker.number.int({ min: 1000, max: 1000000 }).toString(),
  unitId,
  description: faker.word.words(5),
  kcalPerUnit,
});

const nutrientUnit = (): NutrientUnitRequest => ({
  id: faker.number.int({ min: 1000, max: 1000000 }).toString(),
  description: faker.word.words(5),
  symbol: faker.word.words(1),
});

const standardUnit = (): StandardUnitCreationAttributes => ({
  id: toStandardUnitId(faker.word.words(3)),
  name: faker.word.words(2),
  estimateIn: { en: faker.word.words(5), es: faker.word.words(5) },
  howMany: { en: faker.word.words(5), es: faker.word.words(5) },
});

export default {
  category,
  food,
  foodGroup,
  asServedSet,
  // locale,
  nutrientTable,
  nutrientType,
  nutrientUnit,
  standardUnit,
};
