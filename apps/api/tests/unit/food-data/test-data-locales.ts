import { FoodsLocale } from '@api/db';

export default async () => {
  await FoodsLocale.create({
    adminLanguageId: 'en',
    countryFlagCode: 'gb',
    englishName: 'United Kingdom',
    id: 'en_GB',
    localName: 'United Kingdom',
    prototypeLocaleId: undefined,
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });

  await FoodsLocale.create({
    adminLanguageId: 'en',
    countryFlagCode: 'au',
    englishName: 'Australia',
    id: 'en_AU',
    localName: 'Australia',
    prototypeLocaleId: 'en_GB',
    respondentLanguageId: 'en',
    textDirection: 'ltr',
  });
};
