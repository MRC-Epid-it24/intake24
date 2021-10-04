import faker from 'faker';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import {
  CreateLocaleRequest,
  CreateAsServedSetInput,
  NutrientTableInput,
} from '@common/types/http/admin';
import { downloadImage } from '../util';

const asServedSet = async (asServedSetId?: string): Promise<CreateAsServedSetInput> => {
  const id = asServedSetId ?? nanoid(32);
  const originalname = `${id}.jpg`;

  const filePath = await downloadImage('https://picsum.photos/1200/800.jpg', originalname);

  return {
    id,
    description: `${id}_description`,
    file: { originalname: `${id}.jpg`, path: filePath },
    uploader: 'admin',
  };
};

const locale = (
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

  return {
    id,
    englishName,
    localName,
    respondentLanguageId,
    adminLanguageId,
    countryFlagCode,
    prototypeLocaleId,
    textDirection,
  };
};

const nutrientTable = (): NutrientTableInput => {
  return {
    id: slugify(nanoid(16), { strict: true }),
    description: faker.random.words(5),
    csvMapping: {
      idColumnOffset: faker.datatype.number(100),
      descriptionColumnOffset: faker.datatype.number(100),
      localDescriptionColumnOffset: faker.datatype.number(100),
      rowOffset: faker.datatype.number(100),
    },
    csvMappingFields: [
      {
        fieldName: slugify(nanoid(16), { strict: true }),
        columnOffset: faker.datatype.number(200),
      },
      {
        fieldName: slugify(nanoid(16), { strict: true }),
        columnOffset: faker.datatype.number(200),
      },
      {
        fieldName: slugify(nanoid(16), { strict: true }),
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

export default {
  asServedSet,
  locale,
  nutrientTable,
};
